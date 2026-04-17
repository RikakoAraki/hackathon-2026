import json
import os

from fastapi import HTTPException
from openai import OpenAI

from app.schemas.generator import GenerateGameRequest
from app.schemas.yamibaito import GameMode


def get_mode_meta(mode_type: str) -> dict:
    if mode_type == "rumor":
        return {
            "title_hint": "デマ拡散防止ゲーム",
            "description_hint": "SNS上の怪しい投稿や誤情報への対応を学ぶ教育ゲーム",
            "apply_label": "拡散する",
            "player_role": "あなたはSNS運営チームです",
            "unit_label": "投稿",
            "header_label": "TIMELINE MODERATION",
            "theme_detail": "出典不明の投稿、煽り文句、誤誘導リンク、フェイクニュースなどを題材にする",
        }
    elif mode_type == "yami_baito":
        return {
            "title_hint": "闇バイト危険度チェック",
            "description_hint": "怪しい求人を見極めて安全な判断を学ぶ教育ゲーム",
            "apply_label": "応募する",
            "player_role": "あなたは応募を検討中の学生です",
            "unit_label": "求人",
            "header_label": "JOB SAFETY CHECK",
            "theme_detail": "高収入すぎる求人、身分証要求、SNS連絡限定、口座貸与依頼などを題材にする",
        }
    else:
        raise HTTPException(status_code=400, detail="Invalid mode_type")


SYSTEM_PROMPT = """
あなたは教育用ミニゲームの設計者です。
与えられたモードに基づいて、ゲーム設定データをJSONで生成してください。

出力ルール:
- 必ずJSONのみを返す
- 説明文やコードブロックは不要
- actions の key は "apply", "ignore", "report" のみ
- actions の label は指定されたラベルを使う
- meters は safety, risk, awareness の3つを使う
- 各 meter は key, label, min, max, initial を持つ
- cards は現実的で教育的な内容にする
- effects は各 action ごとに values を持つ
- values の値は整数
- 内容は高校生・大学生にもわかりやすくする
- JSONの構造は厳密に守る
"""


def build_user_prompt(req: GenerateGameRequest) -> str:
    meta = get_mode_meta(req.mode_type)

    return f"""
モード: {req.mode_type}
難易度: {req.difficulty}
カード枚数: {req.card_count}

このゲームの意図:
- タイトルは {meta["title_hint"]} に合うもの
- 説明は {meta["description_hint"]}
- 題材は {meta["theme_detail"]}

actions の label は次を厳守:
- apply: {meta["apply_label"]}
- ignore: 無視する
- report: 通報する

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
    {{ "key": "apply", "label": "{meta["apply_label"]}" }},
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))