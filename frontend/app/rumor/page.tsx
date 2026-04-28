"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Send,
  Shield,
  Search,
  Lightbulb,
  Goal,
  CircleCheck,
  Target,
  Newspaper,
} from "lucide-react";
import Link from "next/link";
import LoadingCard from "@/components/common/LoadingCard";
import { ActionKey, RumorCard as RumorCardType, RumorGameMode } from "@/lib/types";

const BG_COLORS = [
  "bg-red-200", "bg-orange-200", "bg-yellow-200", "bg-green-200",
  "bg-teal-200", "bg-blue-200", "bg-indigo-200", "bg-purple-200", "bg-pink-200",
];
const HANDLES = [
  "sakura_days", "shota_log", "hana_chan22", "taro_kun_jp", "aimi_note",
  "kenji_post", "megrin_SNS", "yuuki_gamer", "rina_pi_pi", "hiro_daily",
];

function seededIndex(seed: string, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % max;
}
function seededNum(seed: string, min: number, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return min + (hash % (max - min));
}

type HistoryEntry = { cardId: string; action: ActionKey };
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export default function RumorPage() {
  const [mode, setMode] = useState<RumorGameMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMode = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/generator/game-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode_type: "rumor", difficulty: "normal", card_count: 5 }),
      });
      if (!res.ok) throw new Error("failed to fetch");
      const data: RumorGameMode = await res.json();
      setMode(data);
      setCurrentIndex(0);
      setHistory([]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMode(); }, []);

  if (loading || !mode) {
    return (
      <LoadingCard
        title="読み込み中…"
        description="投稿データを読み込んでいます"
        theme="blue"
        icon={<Search className="h-9 w-9 text-blue-500" strokeWidth={2.2} />}
      />
    );
  }

  const finished = currentIndex >= mode.cards.length;
  const currentCard = mode.cards[currentIndex];

  const handleAction = (action: ActionKey) => {
    if (!currentCard) return;
    setHistory((prev) => [...prev, { cardId: currentCard.id, action }]);
    setCurrentIndex((prev) => prev + 1);
  };

  const correctCount = history.filter((h, i) => h.action === mode.cards[i].correct_action).length;
  const score = Math.round((correctCount / mode.cards.length) * 100);
  const answeredCount = history.length;

  const statusItems = [
    {
      title: "進行度",
      value: Math.min(currentIndex + 1, mode.cards.length),
      maxLabel: `/ ${mode.cards.length}`,
      color: "blue" as const,
      progress: Math.round((answeredCount / mode.cards.length) * 100),
    },
    {
      title: "正解数",
      value: correctCount,
      maxLabel: `/ ${mode.cards.length}`,
      color: "green" as const,
      progress: Math.round((correctCount / mode.cards.length) * 100),
    },
    {
      title: "スコア",
      value: score,
      maxLabel: "/ 100",
      color: "red" as const,
      progress: score,
    },
  ];

  return (
    <main className="min-h-screen bg-sky-100 p-4 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-3">
        <section className="rounded-2xl bg-blue-500 p-4 text-white shadow-md">
          <h2 className="mb-1 text-xl font-bold">⚠ ミッション：デマ拡散ストッパー</h2>
          <p className="text-sm font-medium">{mode.description}</p>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {statusItems.map((s) => (
            <StatusCard key={s.title} {...s} />
          ))}
        </section>

        {!finished && currentCard && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="flex items-center gap-2 text-lg font-bold">
                  <Newspaper className="h-5 w-5 text-blue-500" />
                  投稿情報
                </h2>
                <span className="text-sm text-slate-400">投稿 {currentIndex + 1} / {mode.cards.length}</span>
              </div>

              <TweetContent card={currentCard} />
            </div>

            <aside className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-emerald-700">
                <Search className="h-5 w-5 text-emerald-600" />
                チェックポイント
              </h2>
              <p className="text-sm font-bold">この投稿で気になる点は？</p>
              <p className="mb-3 text-xs text-slate-500">（複数選択可）</p>
              <div className="space-y-2 text-sm">
                {[
                  "根拠が不明確・デマの可能性が高い",
                  "不安をあおる表現が含まれている",
                  "過去の体験や噂を根拠にしている",
                  "具体的な証拠や出典がない",
                  "注意喚起として価値がある",
                  "その他",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 accent-emerald-500" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
              <div className="mt-4 rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                <p className="mb-1 flex items-center gap-2 text-sm font-bold">
                  <Lightbulb className="h-4 w-4 text-yellow-500" />
                  ヒント
                </p>
                <p className="text-xs">
                  デマの特徴を思い出してみよう。「不安をあおる」「根拠がない」がカギかも？
                </p>
              </div>
            </aside>
          </section>
        )}

        {!finished && currentCard && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mode.actions.map((action) => (
              <ActionButton
                key={action.key}
                icon={actionIcon(action.key)}
                title={action.label}
                subtitle={getActionSubtitle(action.key)}
                className={getActionClass(action.key)}
                onClick={() => handleAction(action.key)}
              />
            ))}
          </section>
        )}

        {finished && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg">
            <p className="mb-2 text-sm font-semibold tracking-wide text-sky-700">RESULT</p>
            <p className="mb-1 text-5xl font-bold text-slate-900">
              {score}<span className="text-2xl font-normal text-slate-500"> / 100</span>
            </p>
            <p className="mb-6 text-slate-500">{correctCount} / {mode.cards.length} 問正解</p>

            <div className="mb-6 space-y-3">
              {mode.cards.map((card, i) => {
                const taken = history[i]?.action;
                const correct = card.correct_action;
                const isCorrect = taken === correct;
                const takenLabel = mode.actions.find((a) => a.key === taken)?.label ?? taken;
                const correctLabel = mode.actions.find((a) => a.key === correct)?.label ?? correct;
                return (
                  <div key={card.id} className={`rounded-2xl p-4 text-sm ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "✓ 正解" : "✗ 不正解"}
                      </span>
                      <span className="text-slate-500">あなた: {takenLabel}</span>
                      {!isCorrect && <span className="text-slate-500">→ 正解: {correctLabel}</span>}
                    </div>
                    <p className="mb-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-6 text-slate-700">
                      {card.body}
                    </p>
                    <p className="leading-6 text-slate-600">{card.reason}</p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={fetchMode}
                className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90"
              >
                もう一度プレイ
              </button>
              <Link
                href="/"
                className="rounded-2xl border border-slate-300 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                トップに戻る
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function TweetContent({ card }: { card: RumorCardType }) {
  const bgColor = useMemo(() => BG_COLORS[seededIndex(card.id + "bg", BG_COLORS.length)], [card.id]);
  const handle = useMemo(() => HANDLES[seededIndex(card.id + "handle", HANDLES.length)], [card.id]);
  const likes = useMemo(() => seededNum(card.id + "l", 12, 980), [card.id]);
  const reposts = useMemo(() => seededNum(card.id + "r", 3, 340), [card.id]);
  const comments = useMemo(() => seededNum(card.id + "c", 1, 120), [card.id]);
  const timeLabel = useMemo(() => `${seededNum(card.id + "t", 1, 59)}分前`, [card.id]);

  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 space-y-3">
      <div className="flex items-start gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor} flex-shrink-0`}>
          <svg className="h-7 w-7 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-slate-900">{card.author}</p>
            {card.is_verified && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-sky-500 text-white text-xs">✓</span>
            )}
          </div>
          <p className="text-sm text-slate-400">@{handle} · {timeLabel}</p>
        </div>
      </div>
      <p className="whitespace-pre-wrap leading-7 text-slate-800">{card.body}</p>
      <div className="flex items-center gap-6 border-t border-slate-100 pt-3 text-sm text-slate-400">
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {comments}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {reposts}
        </span>
        <span className="flex items-center gap-1.5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likes}
        </span>
      </div>
    </div>
  );
}

function actionIcon(key: ActionKey): ReactNode {
  switch (key) {
    case "share":
      return <Send className="h-7 w-7" />;
    case "ignore":
      return <Shield className="h-7 w-7" />;
    default:
      return <Send className="h-7 w-7" />;
  }
}

function getActionClass(key: ActionKey) {
  switch (key) {
    case "share":
      return "bg-blue-500 hover:bg-blue-600 text-white";
    case "ignore":
    case "hold":
    case "hide":
      return "bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50";
    default:
      return "bg-white border-2 border-blue-500 text-blue-500 hover:bg-blue-50";
  }
}

function getActionSubtitle(key: ActionKey) {
  switch (key) {
    case "share":
      return "この投稿を拡散する";
    case "ignore":
    case "hold":
    case "hide":
    default:
      return "この投稿は見送る";
  }
}

function StatusCard({
  title,
  value,
  maxLabel,
  color,
  progress,
}: {
  title: string;
  value: number;
  maxLabel: string;
  color: "blue" | "red" | "green";
  progress: number;
}) {
  const colorMap = {
    blue: { text: "text-blue-500", bar: "bg-blue-500" },
    red: { text: "text-red-500", bar: "bg-red-500" },
    green: { text: "text-emerald-500", bar: "bg-emerald-500" },
  };

  const iconMap: Record<string, ReactNode> = {
    進行度: <Goal className="h-5 w-5 text-blue-500" />,
    正解数: <CircleCheck className="h-5 w-5 text-emerald-500" />,
    スコア: <Target className="h-5 w-5 text-red-500" />,
  };

  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold">
          {iconMap[title]}
          {title}
        </h3>
        <p className={`text-xl font-bold ${colorMap[color].text}`}>
          {value}
          <span className="text-xs font-normal text-slate-500">{maxLabel}</span>
        </p>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${colorMap[color].bar}`}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  title,
  subtitle,
  className,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  className: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl p-4 shadow-md transition active:scale-95 ${className}`}
    >
      <div className="flex items-center justify-center gap-3">
        {icon}
        <div className="text-left">
          <p className="text-2xl font-bold">{title}</p>
          <p className="text-sm font-bold opacity-90">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}
