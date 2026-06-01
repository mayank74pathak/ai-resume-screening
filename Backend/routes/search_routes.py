from fastapi import APIRouter
from database.mongodb import chunk_collection
from services.embedding_service import generate_embedding
import numpy as np

router = APIRouter()

def cosine_similarity(vec1, vec2):

    vec1 = np.array(vec1)
    vec2 = np.array(vec2)

    return np.dot(vec1, vec2) / (
        np.linalg.norm(vec1) * np.linalg.norm(vec2)
    )

@router.post("/search")
async def search_candidates(payload: dict):

    query = payload["query"]

    query_embedding = generate_embedding(query)

    chunks = await chunk_collection.find().to_list(length=5000)

    results = []

    for chunk in chunks:

        score = cosine_similarity(
            query_embedding,
            chunk["embedding"]
        )

        results.append({
            "resume_id": chunk["resume_id"],
            "chunk_text": chunk["chunk_text"],
            "score": float(score)
        })

    results.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    return results[:10]    