# SNSリテラシー体験ゲーム

SNS上のデマ拡散・闇バイトへの誘惑という身近なリスクを、ゲーム感覚で学べる教育コンテンツです。

## ゲームモード

### MODE 01 — デマ拡散ストッパー
SNSに流れてくる「それっぽい投稿」を見て、**拡散する / 無視する** を判断します。  
正解・不正解の根拠を読んで、情報を見極める力を身につけます。

### MODE 02 — 闇バイトみきわめシミュレーター
リアルな求人票を読んで、**応募する / 無視する** を判断します。  
怪しい求人に共通するフラグを学びます。

どちらのモードも問題はAI（GPT）がゲームごとに生成するため、毎回異なる内容で遊べます。

---

## 技術スタック

| レイヤー | 技術 |
|---|---|
| フロントエンド | Next.js 16 / React 19 / TypeScript / Tailwind CSS |
| バックエンド | FastAPI / Python 3.10 |
| AI | OpenAI API (GPT) |

---

## セットアップ

### 前提条件
- Node.js 18以上
- Python 3.10以上
- OpenAI APIキー

### バックエンド

```bash
cd backend
pip install -r requirements.txt   # または environment.yml を使う場合: conda env create -f ../environment.yml
```

`.env` ファイルを作成して APIキーを設定します:

```
OPENAI_API_KEY=sk-...
```

起動:

```bash
python3.10 -m uvicorn app.main:app --reload
```

`http://localhost:8000` で起動します。

### フロントエンド

```bash
cd frontend
npm install
npm run dev
```

`http://localhost:3000` で起動します。

---

## 画面構成

```
/            トップページ（モード選択）
/rumor       デマ拡散ストッパー
/yami-baito  闇バイトみきわめシミュレーター
```

---

## スコアリング

各問題 **20点満点**（問題数 × 20 = 100点満点）。

| 判定 | 点数 |
|---|---|
| ✓ 正解 | +20 |
| △ 惜しい（部分正解） | +10 |
| ✗ 不正解 | +0 |

結果画面では各問題の正誤と解説を確認できます。
