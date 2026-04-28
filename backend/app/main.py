from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.yamibaito import router as yamibaito_router
from app.routers.generator import router as generator_router

app = FastAPI(title="Hackathon Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(yamibaito_router)
app.include_router(generator_router)


@app.get("/health")
def health_check():
    return {"status": "ok"}