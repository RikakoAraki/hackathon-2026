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
            "description_hint": "SNS上の誤情報への対応を学ぶ教育ゲーム",
            "apply_label": "拡散する",
            "player_role": "あなたはSNS運営チームです",
            "unit_label": "投稿",
            "header_label": "TIMELINE MODERATION",
            "theme_detail": """
実際に起きうるSNS投稿を題材にする。以下の点を必ず守ること:
- 一見もっともらしく、すぐには嘘と気づきにくい内容にする
- 「明らかに怪しい」「絶対に嘘」と分かる極端な表現は使わない
- 実在しそうな具体的なアカウント名・状況・数字を含める
- 例: 地震・台風・感染症・食品・交通などの生活に関わるテーマ
- 例: 「○○駅で今朝から水道が止まっている」「△△市のスーパーで食中毒が出た」など
- 正しい情報・誤った情報・不確かな情報が混在するようにする
- 投稿者は普通の市民・専門家・公式アカウントなど多様にする
""",
        }
    elif mode_type == "yami_baito":
        return {
            "title_hint": "闇バイト見極めシミュレーター",
            "description_hint": "求人票を読んで応募の判断を学ぶ教育ゲーム",
            "apply_label": "応募する",
            "player_role": "あなたは応募を検討中の学生です",
            "unit_label": "求人",
            "header_label": "JOB SAFETY CHECK",
            "theme_detail": """
実在しそうな求人票を生成する。以下を守ること:
- 明らかに怪しいものから一見普通に見えるものまで混在させる
- 危険な求人は「高収入すぎる」「仕事内容が曖昧」「SNS・DMのみ連絡」「身分証を個人に送る」「口座貸与」などのフラグを自然な文体で含める
- 安全な求人は条件・連絡先・会社名が明確で現実的な内容にする
- 求人票の各フィールドに具体的な情報を入れる（曖昧な「詳細は面接で」は危険フラグとして使ってよい）
- 企業からのメッセージは勧誘感のある文体や、過度に友好的な文体にしてよい
""",
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
- cards の description はSNS投稿そのものの文章だけを書く
- 「〜と、匿名の投稿」「根拠リンクがない」「時刻と場所は具体的だが」のような解説・注釈・分析は絶対に入れない
- 「※これはデマです」「明らかに怪しい」などのコメントも絶対に入れない
- description はあくまで投稿者が書いたSNSのテキストそのものとして書く
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
            "title": "求人タイトル",
            "wage": "時給・日給・月給など具体的な金額",
            "description": "仕事内容の詳細（2〜3文）",
            "location": "勤務地（駅名・エリアなど）",
            "working_hours": "勤務時間帯とシフト形態",
            "requirements": "応募資格・条件",
            "benefits": "待遇・福利厚生",
            "how_to_apply": "応募方法（連絡先・方法）",
            "company_message": "企業・募集主からのメッセージ（1〜2文）",
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