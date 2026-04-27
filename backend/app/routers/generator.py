from fastapi import APIRouter, HTTPException
from typing import Union

from app.schemas.generator import GenerateGameRequest
from app.schemas.rumor import RumorGameMode
from app.schemas.yamibaito import GameMode
from app.services.game_generator import generate_rumor_mode, generate_yami_baito_mode

router = APIRouter(prefix="/api/generator", tags=["generator"])


@router.post("/game-mode")
def generate_game(req: GenerateGameRequest) -> Union[RumorGameMode, GameMode]:
    try:
        if req.mode_type == "rumor":
            return generate_rumor_mode(req)
        else:
            return generate_yami_baito_mode(req)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
