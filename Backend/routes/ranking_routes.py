from fastapi import APIRouter, HTTPException
from database.mongodb import (
    chunk_collection,
    candidate_collection
)
from services.embedding_service import (
    generate_embedding
)
from services.llm_service import (
    rank_candidate
)

import numpy as np
from bson import ObjectId
from collections import defaultdict

router = APIRouter()


def cosine_similarity(vec1, vec2):

    vec1 = np.array(vec1)
    vec2 = np.array(vec2)

    return np.dot(vec1, vec2) / (
        np.linalg.norm(vec1)
        * np.linalg.norm(vec2)
    )


@router.post("/rank-candidates")
async def rank_candidates(payload: dict):

    try:

        job_description = payload["job_description"]

        # Recruiter controls number of results
        top_k = payload.get("top_k", 5)

        # Validation
        if top_k < 1:
            top_k = 1

        if top_k > 100:
            top_k = 100

        print(
            f"Ranking request received. top_k={top_k}"
        )

        # Query Embedding
        query_embedding = generate_embedding(
            job_description
        )

        # Fetch chunks
        chunks = await chunk_collection.find().to_list(
            length=5000
        )

        resume_scores = defaultdict(list)

        for chunk in chunks:

            if "embedding" not in chunk:
                continue

            score = cosine_similarity(
                query_embedding,
                chunk["embedding"]
            )

            resume_scores[
                chunk["resume_id"]
            ].append(score)

        ranked_candidates = []

        for resume_id, scores in resume_scores.items():

            avg_score = (
                sum(scores)
                / len(scores)
            )

            ranked_candidates.append({
                "resume_id": resume_id,
                "score": avg_score
            })

        ranked_candidates.sort(
            key=lambda x: x["score"],
            reverse=True
        )

        if not ranked_candidates:
            return {
                "message":
                "No candidates found"
            }

        top_candidates = ranked_candidates[
            :top_k
        ]

        final_results = []

        for candidate_data in top_candidates:

            resume_id = candidate_data[
                "resume_id"
            ]

            candidate = await candidate_collection.find_one(
                {
                    "_id": ObjectId(
                        resume_id
                    )
                }
            )

            if not candidate:
                continue

            resume_context = candidate.get(
                "resume_text",
                ""
            )

            print(
                f"Ranking candidate: "
                f"{candidate.get('candidate_name')}"
            )

            gemini_result = rank_candidate(
                job_description,
                resume_context
            )

            # Candidate Name
            gemini_result["candidate"] = (
                candidate.get(
                    "candidate_name",
                    "Unknown Candidate"
                )
            )

            # Similarity Score
            similarity_score = round(
                candidate_data["score"] * 100,
                2
            )

            gemini_result[
                "similarity_score"
            ] = similarity_score

            # Safe match score conversion
            match_score = float(
                gemini_result.get(
                    "match_score",
                    0
                )
            )

            # ATS Score
            final_score = (
                match_score * 0.7
                +
                similarity_score * 0.3
            )

            gemini_result[
                "final_score"
            ] = round(
                final_score,
                2
            )

            final_results.append(
                gemini_result
            )

        # Sort by final ATS score
        final_results.sort(
            key=lambda x: x[
                "final_score"
            ],
            reverse=True
        )

        return final_results

    except Exception as e:

        print(
            "RANKING ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
