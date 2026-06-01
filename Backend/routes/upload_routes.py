from services.resumeparser import extract_text_from_pdf
from fastapi import APIRouter, UploadFile, File, HTTPException
from datetime import datetime, timezone
from database.mongodb import candidate_collection, chunk_collection
from services.embedding_service import generate_embedding
from rag.chunking import chunk_text
from bson import ObjectId
import shutil
import os

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@router.get("/resumes")
async def get_all_resumes():

    resumes = await candidate_collection.find().to_list(length=100)

    for resume in resumes:
        resume["_id"] = str(resume["_id"])

    return resumes


@router.get("/resume/{resume_id}")
async def get_resume_by_id(resume_id: str):

    resume = await candidate_collection.find_one(
        {"_id": ObjectId(resume_id)}
    )

    if not resume:
        return {
            "message": "Resume not found"
        }

    resume["_id"] = str(resume["_id"])

    return resume


@router.delete("/resume/{resume_id}")
async def delete_resume(resume_id: str):

    result = await candidate_collection.delete_one(
        {"_id": ObjectId(resume_id)}
    )

    if result.deleted_count == 0:
        return {
            "message": "Resume not found"
        }

    return {
        "message": "Resume deleted successfully"
    }


@router.post("/upload-resume")
async def upload_resume(file: UploadFile = File(...)):

    try:

        file_path = f"{UPLOAD_FOLDER}/{file.filename}"

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text
        extracted_text = extract_text_from_pdf(
            file_path
        )

        # Chunking
        chunks = chunk_text(extracted_text)

        print(
            f"Total chunks created: {len(chunks)}"
        )

        # Candidate name
        candidate_name = (
            extracted_text.split("\n")[0].strip()
            if extracted_text
            else "Unknown Candidate"
        )

        # Save resume
        resume_document = {
            "candidate_name": candidate_name,
            "filename": file.filename,
            "resume_text": extracted_text,
            "uploaded_at": datetime.now(
                timezone.utc
            )
        }

        result = await candidate_collection.insert_one(
            resume_document
        )

        print(
            f"Resume saved: {result.inserted_id}"
        )

        # Save chunks
        for idx, chunk in enumerate(chunks):

            print(
                f"Processing chunk {idx}"
            )

            embedding = generate_embedding(
                chunk
            )

            chunk_document = {
                "resume_id": str(
                    result.inserted_id
                ),
                "chunk_index": idx,
                "chunk_text": chunk,
                "embedding": embedding
            }

            await chunk_collection.insert_one(
                chunk_document
            )

            print(
                f"Chunk stored {idx}"
            )

        response_data = {
            "message":
            "Resume uploaded and stored successfully",
            "document_id": str(
                result.inserted_id
            ),
            "chunks": len(chunks)
        }

        print(
            "Returning response:",
            response_data
        )

        return response_data

    except Exception as e:

        print(
            "UPLOAD ERROR:",
            str(e)
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
