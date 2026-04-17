from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()
client = Groq()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)
 
class TextInput(BaseModel):
    text: str

@app.post("/correct")
async def correct_grammar(input: TextInput):
    message = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=1024,
        messages=[
            {
                "role": "user",
                "content": f"""You are a grammar correction assistant.

Correct the following sentence and explain what was wrong.
Format your response exactly like this:
✅ Corrected: <corrected sentence>
📝 Explanation: <what was wrong and why>

Sentence: {input.text}"""
            }
        ]
    )
    return {"result": message.choices[0].message.content}