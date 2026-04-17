from app.schemas.yamibaito import GameMode

YAMI_BAITO_MODE = GameMode(
    title="闇バイト危険度チェック",
    description="怪しい求人を見極めて、安全に行動できるかをチェックするゲームです。",
    meters=[
        {
            "key": "safety",
            "label": "安全度",
            "min": 0,
            "max": 100,
            "initial": 50,
        },
        {
            "key": "risk",
            "label": "危険度",
            "min": 0,
            "max": 100,
            "initial": 50,
        },
        {
            "key": "awareness",
            "label": "警戒心",
            "min": 0,
            "max": 100,
            "initial": 50,
        },
    ],
    actions=[
        {"key": "apply", "label": "応募する"},
        {"key": "ignore", "label": "無視する"},
        {"key": "report", "label": "通報する"},
    ],
    cards=[
        {
            "id": "card_1",
            "title": "高収入・即日現金支給",
            "description": "仕事内容は簡単、詳細はDMで。本人確認不要。",
            "effects": {
                "apply": {"values": {"risk": 25, "safety": -20, "awareness": -10}},
                "ignore": {"values": {"risk": -5, "awareness": 5}},
                "report": {"values": {"risk": -15, "safety": 10, "awareness": 10}},
            },
        },
        {
            "id": "card_2",
            "title": "荷物を運ぶだけの簡単バイト",
            "description": "短時間で高額報酬。連絡はSNSのみ。",
            "effects": {
                "apply": {"values": {"risk": 20, "safety": -15, "awareness": -5}},
                "ignore": {"values": {"risk": -5, "awareness": 5}},
                "report": {"values": {"risk": -10, "safety": 10, "awareness": 10}},
            },
        },
        {
            "id": "card_3",
            "title": "口座貸してください",
            "description": "謝礼あり。身分証があればOK。",
            "effects": {
                "apply": {"values": {"risk": 30, "safety": -25, "awareness": -15}},
                "ignore": {"values": {"risk": -5, "awareness": 5}},
                "report": {"values": {"risk": -20, "safety": 10, "awareness": 10}},
            },
        },
    ],
)