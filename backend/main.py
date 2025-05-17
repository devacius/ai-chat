import os
from typing import Union
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
import httpx

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

# Response payload
class ChatResponse(BaseModel):
    response: str


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
    headers = {
        "Authorization": f"Bearer {TOGETHER_API_KEY}",
        "Content-Type": "application/json"
    }

    payload = {
        "model": MODEL_NAME,
        "messages": [
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": request.message}
        ]
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(TOGETHER_API_URL, json=payload, headers=headers)
            response.raise_for_status()
            data = response.json()
            content = data['choices'][0]['message']['content']
            return {"response": content.strip()}
        except httpx.HTTPError as e:
            raise HTTPException(status_code=500, detail=f"LLM API error: {str(e)}")