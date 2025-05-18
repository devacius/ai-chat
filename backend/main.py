import os
from typing import List, Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, File, HTTPException, UploadFile
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx
import numpy as np
from sentence_transformers import SentenceTransformer
model = SentenceTransformer('all-MiniLM-L6-v2')
import fitz
import faiss


app = FastAPI()
load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
TOGETHER_API_URL = "https://api.together.xyz/v1/chat/completions"
MODEL_NAME = "mistralai/Mixtral-8x7B-Instruct-v0.1"  # or any supported model
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Your Angular app's origin
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Request payload
class ChatRequest(BaseModel):
    message: str
    file_id:str

# Response payload
class ChatResponse(BaseModel):
    response: str

def get_embeddings(chunks: List[str]):
    return model.encode(chunks, show_progress_bar=True)

def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = words[i:i + chunk_size]
        chunks.append(" ".join(chunk))
    return chunks

async def query_llm(user_message: str) -> str:
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": user_message}
        ]
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(TOGETHER_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            return data['choices'][0]['message']['content'].strip()
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"LLM API error: {str(e)}")
@app.get("/")
def read_root():
    return {"Hello": "Shit"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}
class QueryRequest(BaseModel):
    query: str

@app.post("/extract-query",response_model=ChatResponse)
async def extract_query(request: QueryRequest):
    print(f"Received Query: {request.query}")
    content = await query_llm(request.query)
    return {"response": content}


@app.post("/chat", response_model=ChatResponse)
async def chat_with_llm(request: ChatRequest):
    file_id = request.file_id

    if file_id not in session_store:
        raise HTTPException(status_code=404, detail="File not found. Upload it first.")

    faiss_index = session_store[file_id]["faiss"]
    chunks = session_store[file_id]["chunks"]

    # Get embedding for the user query
    query_embedding = model.encode([request.message])[0]
    query_vector = np.array([query_embedding], dtype='float32')

    # Search for similar chunks
    k = 5  # Number of top results to retrieve
    distances, indices = faiss_index.search(query_vector, k)

    # Gather the most relevant chunks
    retrieved_chunks = [chunks[i] for i in indices[0] if i < len(chunks)]
    context = "\n".join(retrieved_chunks)

    # Ask LLM with context + question
    prompt = f"""You are a helpful assistant. Answer the question based on the following context from a PDF:
    
Context:
{context}

Question: {request.message}
"""

    response_text = await query_llm(prompt)
    return {"response": response_text}
        

def build_faiss_index(embeddings: List[List[float]]) -> faiss.IndexFlatL2:
    dim = len(embeddings[0])
    index = faiss.IndexFlatL2(dim)
    index.add(np.array(embeddings).astype('float32'))
    return index

session_store = {}
@app.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):

    contents = await file.read()

    # max_size = 1 * 1024 * 1024  # 1MB in bytes
    # if len(contents) > max_size:
    #     raise HTTPException(status_code=400, detail="File size exceeds 1MB limit.")
    # Optionally save to disk
    filename = f"uploaded_{file.filename}"
    with open(filename, "wb") as f:
        f.write(contents)

    text = extract_text_from_pdf(filename)
    chunks = chunk_text(text)
    embeddings = get_embeddings(chunks)
    index = build_faiss_index(embeddings)

    # Save in memory (for now)
    session_store[file.filename] = {
        "chunks": chunks,
        "faiss": index
    }

    return {"message": "File processed", "file_id": file.filename}

def extract_text_from_pdf(file_path: str) -> str:
    doc = fitz.open(file_path)
    text = ""
    for page in doc:
        text += page.get_text()
    return text