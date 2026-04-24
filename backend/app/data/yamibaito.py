from app.schemas.yamibaito import GameMode

YAMI_BAITO_MODE = GameMode(
    title="闇バイト見極めシミュレーター",
    description="高収入バイトの募集やDMを見て、応募・無視・通報を判断してください。",
    meters=[
        {"key": "safety", "label": "安全度", "min": 0, "max": 100, "initial": 50},
        {"key": "risk",   "label": "危険度", "min": 0, "max": 100, "initial": 50},
        {"key": "awareness", "label": "警戒心", "min": 0, "max": 100, "initial": 50},
    ],
    actions=[
        {"key": "apply",  "label": "応募する"},
        {"key": "ignore", "label": "無視する"},
        {"key": "report", "label": "通報する"},
    ],
    cards=[
        {
            "id": "card_1",
            "title": "荷物の受け取りスタッフ募集",
            "wage": "日給 50,000円",
            "description": "書類を受け取って指定場所に届けるだけの簡単作業。経験・資格不問。",
            "location": "都内近郊（詳細は採用後に案内）",
            "working_hours": "単発・1日2〜3時間",
            "requirements": "18歳以上、スマホ持参、身分証コピーをDMで送付",
            "benefits": "即日現金払い、交通費別途支給",
            "how_to_apply": "InstagramのDMにて「応募」とメッセージ",
            "company_message": "未経験大歓迎！まずは気軽にDMください😊",
            "effects": {
                "apply":  {"values": {"risk": 30, "safety": -25, "awareness": -10}},
                "ignore": {"values": {"risk": -5, "awareness":  5}},
                "report": {"values": {"risk": -15, "safety": 10, "awareness": 10}},
            },
        },
        {
            "id": "card_2",
            "title": "ホールスタッフ募集（カフェ）",
            "wage": "時給 1,250円",
            "description": "吉祥寺駅近くのカフェでホールを担当していただきます。接客経験があれば歓迎。",
            "location": "吉祥寺駅 徒歩4分",
            "working_hours": "週2日〜、10:00〜21:00のシフト制",
            "requirements": "高校生以上、未経験歓迎",
            "benefits": "交通費全額支給、まかない付き、社会保険完備",
            "how_to_apply": "求人サイト経由またはお電話にて（03-XXXX-XXXX）",
            "company_message": "アットホームな職場です。見学も歓迎しています。",
            "effects": {
                "apply":  {"values": {"risk": -5, "safety": 10, "awareness":  5}},
                "ignore": {"values": {"risk":  0, "awareness":  0}},
                "report": {"values": {"risk":  0, "safety": -5, "awareness": -5}},
            },
        },
        {
            "id": "card_3",
            "title": "夢を叶える軽作業（詳細は面談で）",
            "wage": "月収 500,000円以上可",
            "description": "やる気次第で稼げる仕事です。詳細は採用面談にてご説明します。",
            "location": "都内（渋谷・新宿エリア）",
            "working_hours": "自由シフト・週1〜OK",
            "requirements": "やる気のある方ならどなたでも",
            "benefits": "高収入・インセンティブあり",
            "how_to_apply": "LINEで「応募」とメッセージ（ID: @xxxxx）",
            "company_message": "一緒に夢を叶えましょう！まずは話だけでも聞きにきてください。",
            "effects": {
                "apply":  {"values": {"risk": 20, "safety": -18, "awareness": -10}},
                "ignore": {"values": {"risk": -5, "awareness":  5}},
                "report": {"values": {"risk": -10, "safety":  8, "awareness": 10}},
            },
        },
    ],
)
