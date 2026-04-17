import json
import os

from fastapi import HTTPException
from openai import OpenAI

from app.schemas.generator import GenerateGameRequest
from app.schemas.yamibaito import GameMode


SYSTEM_PROMPT = """
あなたは教育用ミニゲームの設計者です。
与えられたテーマに基づいて、ゲーム設定データをJSONで生成してください。

出力ルール:
- 必ずJSONのみを返す
- 説明文やコードブロックは不要
- keysは指定されたものを厳密に使う
- actions の key は "apply", "ignore", "report" のみ
- meters は3個程度にする
- 各 meter は key, label, min, max, initial を持つ
- cards は現実的で教育的な内容にする
- effects は各 action ごとに values を持つ
- values の値は整数
- 全体として教材として使える内容にする
"""


def build_user_prompt(req: GenerateGameRequest) -> str:
    return f"""
テーマ: {req.theme}
難易度: {req.difficulty}
カード枚数: {req.card_count}

以下のJSON構造で返してください:
{{
  "title": "...",
  "description": "...",
  "meters": [
    {{
      "key": "safety",
      "label": "安全度",
      "min": 0,
      "max": 100,
      "initial": 50
    }},
    {{
      "key": "risk",
      "label": "危険度",
      "min": 0,
      "max": 100,
      "initial": 50
    }},
    {{
      "key": "awareness",
      "label": "警戒心",
      "min": 0,
      "max": 100,
      "initial": 50
    }}
  ],
  "actions": [
    {{ "key": "apply", "label": "応募する" }},
    {{ "key": "ignore", "label": "無視する" }},
    {{ "key": "report", "label": "通報する" }}
  ],
  "cards": [
    {{
      "id": "card_1",
      "title": "...",
      "description": "...",
      "effects": {{
        "apply": {{ "values": {{ "risk": 10, "safety": -5, "awareness": -5 }} }},
        "ignore": {{ "values": {{ "risk": -5, "awareness": 5 }} }},
        "report": {{ "values": {{ "risk": -10, "safety": 10, "awareness": 10 }} }}
      }}
    }}
  ]
}}
"""


def generate_game_mode(req: GenerateGameRequest) -> GameMode:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")

    client = OpenAI(api_key=api_key)

    try:
        response = client.responses.create(
            model="gpt-5.4-nano",
            instructions=SYSTEM_PROMPT,
            input=build_user_prompt(req),
        )

        text = response.output_text
        data = json.loads(text)

        return GameMode(**data)

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Model did not return valid JSON")