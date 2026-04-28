import json
import os

from fastapi import HTTPException
from openai import OpenAI

from app.schemas.generator import GenerateGameRequest
from app.schemas.rumor import RumorGameMode
from app.schemas.yamibaito import GameMode


RUMOR_SYSTEM_PROMPT = """
あなたは教育用ミニゲームの設計者です。
SNS上の投稿を題材にした情報判断ゲームのデータをJSONで生成してください。

出力ルール:
- 必ずJSONのみを返す。説明文・コードブロック不要
- cards の body はSNS投稿本文そのものだけを書く（解説・注釈を入れない）
- 「〜と匿名の投稿」「根拠リンクがない」などの分析コメントは絶対に書かない
- correct_action は必ず "share"/"hide" のいずれか1つ
- reason は「なぜそのアクションが正解か」を1〜2文で書く
- is_verified は公式・行政・報道機関なら true、一般ユーザーなら false
- 正しい投稿・誤った投稿・不確かな投稿を混在させる
- JSONの構造を厳密に守る
"""

YAMI_BAITO_SYSTEM_PROMPT = """
あなたは教育用ミニゲームの設計者です。
与えられたモードに基づいて、ゲーム設定データをJSONで生成してください。

出力ルール:
- 必ずJSONのみを返す
- 説明文やコードブロックは不要
- actions の key は "apply", "ignore", "report" のみ
- meters は safety, risk, awareness の3つを使う
- 各 meter は key, label, min, max, initial を持つ
- effects は各 action ごとに values を持つ
- values の値は整数
- 内容は高校生・大学生にもわかりやすくする
- JSONの構造は厳密に守る
"""


def build_rumor_prompt(req: GenerateGameRequest) -> str:
    return f"""
カード枚数: {req.card_count}
難易度: {req.difficulty}

地震・台風・感染症・食品・交通など生活に関わるテーマのSNS投稿を題材にしてください。
一見もっともらしく、すぐには真偽が判断しにくい内容を混ぜてください。

以下のJSON構造で返してください:
{{
  "title": "デマ拡散ストッパー",
  "description": "SNSの投稿を判断し、正しく対応できるかを試すゲームです。",
  "actions": [
    {{ "key": "share", "label": "拡散" }},
    {{ "key": "hide",  "label": "無視" }}
  ],
  "cards": [
    {{
      "id": "card_1",
      "body": "SNS投稿の本文（投稿者が書いたテキストそのもの）",
      "author": "投稿者名（ニックネームや機関名など）",
      "handle": "author名に対応した英数字のSNSハンドル（@なし・例: city_bousai, health_watch, taro_1128）",
      "is_verified": false,
      "correct_action": "hide",
      "reason": "出典が不明で誤情報の可能性があるため、拡散せず無視するのが正解です。"
    }}
  ]
}}
"""


def build_yami_baito_prompt(req: GenerateGameRequest) -> str:
    return f"""
カード枚数: {req.card_count}
難易度: {req.difficulty}

明らかに怪しいものから一見普通に見えるものまで混在した求人票を生成してください。
危険な求人には「高収入すぎる」「仕事内容が曖昧」「SNS・DMのみ連絡」「身分証を個人に送る」などのフラグを自然な文体で含めてください。

以下のJSON構造で返してください:
{{
  "title": "闇バイト見極めシミュレーター",
  "description": "求人票を読んで応募の判断を学ぶゲームです。",
  "meters": [
    {{ "key": "safety",    "label": "安全度",  "min": 0, "max": 100, "initial": 50 }},
    {{ "key": "risk",      "label": "危険度",  "min": 0, "max": 100, "initial": 50 }},
    {{ "key": "awareness", "label": "警戒心",  "min": 0, "max": 100, "initial": 50 }}
  ],
  "actions": [
    {{ "key": "apply",  "label": "応募する" }},
    {{ "key": "ignore", "label": "無視する" }}
  ],
  "cards": [
    {{
      "id": "card_1",
      "title": "求人タイトル",
      "wage": "時給・日給・月給など具体的な金額",
      "description": "仕事内容の詳細（2〜3文）",
      "location": "勤務地",
      "working_hours": "勤務時間",
      "requirements": "応募資格",
      "benefits": "待遇",
      "how_to_apply": "応募方法",
      "company_message": "企業からのメッセージ（1〜2文）",
      "correct_action": "apply または ignore のいずれか",
      "reason": "なぜそのアクションが正解か（1〜2文で根拠を明示）",
      "effects": {{
        "apply":  {{ "values": {{ "risk": 10, "safety": -5, "awareness": -5 }} }},
        "ignore": {{ "values": {{ "risk": -5, "awareness": 5 }} }},
        "report": {{ "values": {{ "risk": -10, "safety": 10, "awareness": 10 }} }}
      }}
    }}
  ]
}}
"""


def _call_api(system: str, user: str) -> dict:
    api_key = os.environ.get("OPENAI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY is not set")

    client = OpenAI(api_key=api_key)
    try:
        response = client.responses.create(
            model="gpt-5.4-nano",
            instructions=system,
            input=user,
        )
        return json.loads(response.output_text)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Model did not return valid JSON")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def generate_rumor_mode(req: GenerateGameRequest) -> RumorGameMode:
    data = _call_api(RUMOR_SYSTEM_PROMPT, build_rumor_prompt(req))
    return RumorGameMode(**data)


def generate_yami_baito_mode(req: GenerateGameRequest) -> GameMode:
    data = _call_api(YAMI_BAITO_SYSTEM_PROMPT, build_yami_baito_prompt(req))
    return GameMode(**data)
