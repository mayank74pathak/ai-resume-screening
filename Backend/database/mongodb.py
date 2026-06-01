from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URL = os.getenv("MONGO_URL")

client = AsyncIOMotorClient(MONGO_URL)

database = client["ai_resume_db"]

candidate_collection = database["candidates"]
chunk_collection = database["resume_chunks"]

print("MongoDB Connected Successfully")