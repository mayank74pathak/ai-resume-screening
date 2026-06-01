from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.ranking_routes import router as ranking_router
from routes.upload_routes import router as upload_router
from routes.search_routes import router as search_router
from database.mongodb import client



app = FastAPI(
    title="AI Resume Screening System",
    description="RAG-based AI Resume Screening Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload_router)
app.include_router(search_router)
app.include_router(ranking_router)
@app.get("/")
async def home():
    return {
        "message": "AI Resume Screening Backend Running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy"
    }

@app.get("/health/db")
async def db_health():
    try:
        await client.admin.command("ping")
        return {"status": "connected"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}