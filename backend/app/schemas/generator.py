from typing import Literal
from pydantic import BaseModel, Field

ModeType = Literal["rumor", "yami_baito"]


class GenerateGameRequest(BaseModel):
    mode_type: ModeType
    card_count: int = Field(default=5, ge=1, le=20)
    difficulty: str | None = Field(default="normal")