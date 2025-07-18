import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

model = genai.GenerativeModel('gemini-1.5-flash')

def generate_article(topic: str) -> str:
    prompt = f"Write a professional article about: {topic}"
    response = model.generate_content(prompt)
    return response.text.strip()

    

# generate_article("ai")
# print(generate_article("The impact of AI in education"))