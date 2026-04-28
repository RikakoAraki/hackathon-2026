"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  Send,
  ShieldX,
  Flag,
  Briefcase,
  MessageCircleHeart,
  CircleCheck,
  BookOpenCheck,
  Goal,
  Search,
  Lightbulb,
} from "lucide-react";

import LoadingCard from "@/components/common/LoadingCard";
import { ActionKey, GameMode } from "@/lib/types";

type HistoryEntry = { cardId: string; action: ActionKey };

const API_BASE = "http://127.0.0.1:8000";

export default function YamiBaitoPage() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMode = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/generator/game-mode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode_type: "yami_baito",
          difficulty: "normal",
          card_count: 5,
        }),
      });
      if (!res.ok) throw new Error("failed to fetch yami baito mode");

      const data: GameMode = await res.json();
      setMode(data);
      setCurrentIndex(0);
      setHistory([]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMode();
  }, []);

  if (loading || !mode) {
    return (
      <LoadingCard
        title="読み込み中…"
        description="求人データを検索しています"
        theme="orange"
        icon={<Search className="h-9 w-9 text-orange-500" strokeWidth={2.2} />}
      />
    );
  }

  const finished = currentIndex >= mode.cards.length;
  const currentCard = mode.cards[currentIndex] as any;

  const handleAction = (action: ActionKey) => {
    if (!currentCard) return;
    setHistory((prev) => [...prev, { cardId: currentCard.id, action }]);
    setCurrentIndex((prev) => prev + 1);
  };

  const getPoints = (action: ActionKey | undefined, i: number) => {
    const card = mode.cards[i] as any;
    if (!action) return 0;
    if (action === card.correct_action) return 20;
    if (card.partial_actions?.includes(action)) return 10;
    return 0;
  };

  const totalPoints = history.reduce((sum, h, i) => sum + getPoints(h.action, i), 0);
  const score = Math.round((totalPoints / (mode.cards.length * 20)) * 100);

  const correctCount = history.filter((h, i) => getPoints(h.action, i) === 20).length;
  const answeredCount = history.length;
  const progressValue = Math.round((answeredCount / mode.cards.length) * 100);

  const statusCards: {
    title: string;
    value: number;
    maxLabel: string;
    color: "blue" | "red" | "green";
  }[] = [
    { title: "進行度", value: progressValue, maxLabel: "/ 100", color: "blue" },
    { title: "正解数", value: correctCount, maxLabel: `/ ${mode.cards.length}`, color: "green" },
    { title: "獲得点", value: totalPoints, maxLabel: ` / ${mode.cards.length * 20}`, color: "red" },
  ];

  const tags = currentCard?.tags?.length
    ? currentCard.tags
    : ["高収入", "即日払い", "未経験OK", "履歴書不要"];

  const wage = currentCard?.wage ?? "";
  const location = currentCard?.location ?? "都内各所（詳細は連絡時にお伝えします）";
  const shift =
    currentCard?.shift ??
    currentCard?.working_hours ??
    "自由シフト制 / 1日3時間〜OK";
  const requirements =
    currentCard?.requirements ?? "18歳以上（高校生不可）・経験不問";
  const benefits =
    currentCard?.benefits ?? "即日払いOK・交通費支給・服装自由";
  const howToApply =
    currentCard?.how_to_apply ??
    currentCard?.contact ??
    "LINE IDに追加してご連絡ください。ID：@xxxxxxxx";
  const companyMessage =
    currentCard?.company_message ??
    "とにかく稼ぎたい人、大歓迎！やる気があれば誰でもOK！すぐにお金が欲しい人、まずは気軽に連絡してみてください！";

  return (
    <main className="min-h-screen bg-orange-50 p-4 text-slate-800">
      <div className="mx-auto max-w-6xl space-y-3">
        <section className="rounded-2xl bg-orange-400 p-4 text-white shadow-md">
          <h2 className="mb-1 text-xl font-bold">
            ⚠ ミッション：求人の内容を確認し、危険度を判断しよう！
          </h2>
          <p className="text-sm font-medium">
            {mode.description} 応募・無視・通報の判断を行いましょう。
          </p>
        </section>

        <section className="grid grid-cols-3 gap-3">
          {statusCards.map((status) => (
            <StatusCard key={status.title} {...status} />
          ))}
        </section>

        {!finished && currentCard && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <h2 className="mb-2 flex items-center gap-2 text-lg font-bold">
                <Briefcase className="h-5 w-5 text-orange-500" />
                求人情報
              </h2>

              <h3 className="mb-2 text-xl font-bold">{currentCard.title}</h3>

              <div className="mb-3 flex flex-wrap gap-2">
                {tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-xl bg-red-100 px-3 py-1 text-sm font-bold text-red-500"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mb-3 overflow-hidden rounded-xl border">
                <InfoRow
                  label="仕事内容"
                  text={currentCard.body ?? currentCard.description ?? "詳細は不明です。"}
                />
                {wage && <InfoRow label="報酬（時給）" text={wage} />}
                <InfoRow label="勤務地" text={location} />
                <InfoRow label="勤務時間" text={shift} />
                <InfoRow label="応募資格" text={requirements} />
                <InfoRow label="待遇" text={benefits} />
                <InfoRow label="応募方法" text={howToApply} />
              </div>

              <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3">
                <p className="mb-1 flex items-center gap-2 text-sm font-bold">
                  <MessageCircleHeart className="h-4 w-4 text-pink-500" />
                  企業からのメッセージ
                </p>
                <p className="text-sm">{companyMessage}</p>
              </div>
            </div>

            <aside className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 shadow-sm">
              <h2 className="mb-3 flex items-center gap-2 text-lg font-bold text-emerald-700">
                <Search className="h-5 w-5 text-emerald-600" />
                チェックポイント
              </h2>

              <p className="text-sm font-bold">この求人で気になる点は？</p>
              <p className="mb-3 text-xs text-slate-500">（複数選択可）</p>

              <div className="space-y-2 text-sm">
                {[
                  "時給が高すぎる",
                  "仕事内容が曖昧",
                  "勤務地が不明確",
                  "連絡手段がLINEのみ",
                  "即日払いを強調している",
                  "身分証の提出を求めている",
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
                  闇バイトの特徴を思い出してみよう。「甘い話には裏がある」かも？
                </p>
              </div>
            </aside>
          </section>
        )}

        {!finished && currentCard && (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
            <p className="mb-2 text-sm font-semibold tracking-wide text-amber-700">
              RESULT
            </p>
            <p className="mb-1 text-5xl font-bold text-slate-900">
              {score}
              <span className="text-2xl font-normal text-slate-500"> / 100</span>
            </p>
            <p className="mb-6 text-slate-500">
              {totalPoints} / {mode.cards.length * 20} 点
            </p>

            <div className="mb-6 space-y-3">
              {mode.cards.map((card: any, i) => {
                const taken = history[i]?.action;
                const correct = card.correct_action as ActionKey;
                const pts = getPoints(taken, i);
                const isCorrect = pts === 20;
                const isPartial = pts === 10;

                const takenLabel =
                  mode.actions.find((a) => a.key === taken)?.label ?? taken;
                const correctLabel =
                  mode.actions.find((a) => a.key === correct)?.label ?? correct;

                const bgClass = isCorrect
                  ? "bg-green-50 border border-green-200"
                  : isPartial
                    ? "bg-yellow-50 border border-yellow-200"
                    : "bg-red-50 border border-red-200";

                return (
                  <div key={card.id} className={`rounded-2xl p-4 text-sm ${bgClass}`}>
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`font-bold ${
                          isCorrect
                            ? "text-green-600"
                            : isPartial
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {isCorrect
                          ? "✓ 正解 +20"
                          : isPartial
                            ? "△ 惜しい +10"
                            : "✗ 不正解 +0"}
                      </span>
                      <span className="text-slate-500">あなた: {takenLabel}</span>
                      {!isCorrect && (
                        <span className="text-slate-500">→ 正解: {correctLabel}</span>
                      )}
                    </div>

                    <p className="mb-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium leading-6 text-slate-700">
                      {card.title}
                    </p>
                    <p className="leading-6 text-slate-600">{card.reason}</p>
                  </div>
                );
              })}
            </div>

            <button
              onClick={fetchMode}
              className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90"
            >
              もう一度プレイ
            </button>
          </div>
        )}
        
      </div>
    </main>
  );
}

function actionIcon(key: ActionKey): ReactNode {
  switch (key) {
    case "apply":
      return <Send className="h-7 w-7" />;
    case "ignore":
      return <ShieldX className="h-7 w-7" />;
    case "report":
      return <Flag className="h-7 w-7" />;
    default:
      return <Send className="h-7 w-7" />;
  }
}

function getActionClass(key: ActionKey) {
  switch (key) {
    case "apply":
      return "bg-red-400 hover:bg-red-500";
    case "ignore":
      return "bg-yellow-400 hover:bg-yellow-500";
    case "report":
      return "bg-emerald-500 hover:bg-emerald-600";
    default:
      return "bg-slate-400 hover:bg-slate-500";
  }
}

function getActionSubtitle(key: ActionKey) {
  switch (key) {
    case "apply":
      return "この求人に応募する";
    case "ignore":
      return "この求人は見送る";
    case "report":
      return "危険な求人として通報する";
    default:
      return "選択する";
  }
}

function StatusCard({
  title,
  value,
  maxLabel,
  color,
}: {
  title: string;
  value: number;
  maxLabel: string;
  color: "blue" | "red" | "green";
}) {
  const colorMap = {
    blue: "text-blue-500 bg-blue-500",
    red: "text-red-500 bg-red-500",
    green: "text-emerald-500 bg-emerald-500",
  };

  const iconMap = {
    進行度: <Goal className="h-5 w-5 text-blue-500" />,
    正解数: <CircleCheck className="h-5 w-5 text-emerald-500" />,
    獲得点: <BookOpenCheck className="h-5 w-5 text-red-500" />,
  };

  const progressWidth =
    title === "正解数"
      ? Math.min((value / 5) * 100, 100)
      : title === "獲得点"
        ? Math.min((value / 100) * 100, 100)
        : Math.min(value, 100);

  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-base font-bold">
          {iconMap[title as keyof typeof iconMap]}
          {title}
        </h3>
        <p className={`text-xl font-bold ${colorMap[color].split(" ")[0]}`}>
          {value}
          <span className="text-xs font-normal text-slate-500">{maxLabel}</span>
        </p>
      </div>

      <div className="h-2 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${colorMap[color].split(" ")[1]}`}
          style={{ width: `${progressWidth}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] border-b last:border-b-0">
      <div className="bg-slate-100 px-3 py-2 text-sm font-bold">{label}</div>
      <div className="px-3 py-2 text-sm">{text}</div>
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
      className={`rounded-2xl p-4 text-white shadow-md transition active:scale-95 ${className}`}
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