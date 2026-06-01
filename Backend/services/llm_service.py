import google.generativeai as genai
import os
from dotenv import load_dotenv
import json

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)


def rank_candidate(job_description, resume_context):

    prompt = f"""
    Job Description:
    {job_description}

    Candidate Resume:
    {resume_context}

    Analyze the candidate.

    Return ONLY valid JSON.

    Format:

    {{
      "candidate": "Candidate Name",
      "match_score": 0-100,
      "reason": "Short explanation"
    }}

    Do not return markdown.
    Do not return code blocks.
    Only return JSON.
    """

    response = model.generate_content(prompt)

    response_text = response.text.strip()

    # Remove markdown if Gemini adds it
    response_text = response_text.replace(
        "```json",
        ""
    )

    response_text = response_text.replace(
        "```",
        ""
    )

    return json.loads(response_text)