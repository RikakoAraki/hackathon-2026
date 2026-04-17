from pydantic import BaseModel, Field


class GenerateGameRequest(BaseModel):
    theme: str = Field(..., description="生成したいゲームのテーマ")
    difficulty: str | None = Field(default="normal")
    card_count: int = Field(default=5, ge=1, le=20)
