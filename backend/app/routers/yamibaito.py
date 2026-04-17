from fastapi import APIRouter, HTTPException

from app.data.yamibaito import YAMI_BAITO_MODE
from app.schemas.yamibaito import (
    ApplyActionRequest,
    ApplyActionResponse,
    GameMode,
)
from app.services.game_engine import apply_effect, get_ending_comment

router = APIRouter(prefix="/api/yami-baito", tags=["yami-baito"])


@router.get("/mode", response_model=GameMode)
def get_mode():
    return YAMI_BAITO_MODE


@router.post("/apply", response_model=ApplyActionResponse)
def apply_action(payload: ApplyActionRequest):
    card = next(
        (card for card in YAMI_BAITO_MODE.cards if card.id == payload.card_id),
        None,
    )
    if card is None:
        raise HTTPException(status_code=404, detail="Card not found")

    effect = card.effects.get(payload.action)
    if effect is None:
        raise HTTPException(status_code=400, detail="Invalid action")

    next_meters = apply_effect(
        meters=payload.meters,
        effect_values=effect.values,
        mode=YAMI_BAITO_MODE,
    )

    ending_comment = get_ending_comment(YAMI_BAITO_MODE, next_meters)

    return ApplyActionResponse(
        meters=next_meters,
        finished=False,
        ending_comment=ending_comment,
    )