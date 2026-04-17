from fastapi import APIRouter, HTTPException

from app.schemas.generator import GenerateGameRequest
from app.schemas.yamibaito import GameMode
from app.services.game_generator import generate_game_mode

router = APIRouter(prefix="/api/generator", tags=["generator"])


@router.post("/game-mode", response_model=GameMode)
def generate_game(req: GenerateGameRequest):
    try:
        return generate_game_mode(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))