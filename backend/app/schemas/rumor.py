from typing import List, Literal
from pydantic import BaseModel

ActionKey = Literal["share", "factcheck", "hide"]

class ActionDefinition(BaseModel):
    key: ActionKey
    label: str

class RumorCard(BaseModel):
    id: str
    body: str
    author: str
    handle: str
    is_verified: bool = False
    correct_action: ActionKey
    partial_actions: List[ActionKey] = []
    reason: str

class RumorGameMode(BaseModel):
    title: str
    description: str
    actions: List[ActionDefinition]
    cards: List[RumorCard]
