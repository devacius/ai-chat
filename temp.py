from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()
client = OpenAI()
client.api_key = os.getenv("OPENAI_API_KEY")


completion = client.chat.completions.create(
    model="o3-mini",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {
            "role": "user",
            "content": "Write a haiku about recursion in programming."
        }
    ]
)

print(completion.choices[0].message.content)