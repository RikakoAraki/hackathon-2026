from typing import Dict, List, Literal, Optional
from pydantic import BaseModel, Field


ActionKey = Literal["apply", "ignore"]


class MeterDefinition(BaseModel):
    key: str
    label: str
    min: int = 0
    max: int = 100
    initial: int = 50


class ActionDefinition(BaseModel):
    key: ActionKey
    label: str


class CardEffect(BaseModel):
    values: Dict[str, int] = Field(default_factory=dict)


class Card(BaseModel):
    id: str
    title: str
    wage: str
    description: str
    location: str
    working_hours: str
    requirements: str
    benefits: str
    how_to_apply: str
    company_message: str
    correct_action: ActionKey
    partial_actions: List[ActionKey] = []
    reason: str
    effects: Dict[ActionKey, CardEffect] = Field(default_factory=dict)


class EndingComment(BaseModel):
    title: str
    body: str


class GameMode(BaseModel):
    title: str
    description: str
    meters: List[MeterDefinition]
    actions: List[ActionDefinition]
    cards: List[Card]
    ending_comments: Optional[List[EndingComment]] = None


class ApplyActionRequest(BaseModel):
    meters: Dict[str, int]
    card_id: str
    action: ActionKey


class ApplyActionResponse(BaseModel):
    meters: Dict[str, int]
    finished: bool
    ending_comment: str