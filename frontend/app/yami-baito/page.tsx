"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import { Send, ShieldX, Flag } from "lucide-react";
import ResultPanel from "@/components/game/ResultPanel";
import LoadingCard from "@/components/common/LoadingCard";
import { Search } from "lucide-react";

import {
  applyEffect,
  createInitialMeters,
  getEndingComment,
} from "@/lib/gameEngine";
import { ActionKey, GameMode, MeterState } from "@/lib/types";

export default function YamiBaitoPage() {
  const [mode, setMode] = useState<GameMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meters, setMeters] = useState<MeterState>({});
  const [history, setHistory] = useState<{ cardId: string; action: ActionKey }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMode = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/generator/game-mode", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode_type: "yami_baito",
            difficulty: "normal",
            card_count: 5,
          }),
        });

        if (!res.ok) {
          throw new Error("failed to fetch yami baito mode");
        }

        const data: GameMode = await res.json();
        setMode(data);
        setMeters(createInitialMeters(data));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMode();
  }, []);

  const finished = mode ? currentIndex >= mode.cards.length : false;
  const currentCard = mode ? mode.cards[currentIndex] : null;

  const endingComment = useMemo(
    () => (mode ? getEndingComment(mode, meters) : ""),
    [mode, meters]
  );

  const handleAction = (action: ActionKey) => {
    if (!currentCard || !mode) return;

    const effect = currentCard.effects[action];
    const nextMeters = applyEffect(meters, effect, mode);

    setMeters(nextMeters);
    setHistory((prev) => [...prev, { cardId: currentCard.id, action }]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    if (!mode) return;
    setCurrentIndex(0);
    setMeters(createInitialMeters(mode));
    setHistory([]);
  };

  const statusCards: { title: string; value: number; color: "blue" | "red" | "green" }[] = [
    { title: "安全度", value: meters.safety ?? 50, color: "blue" },
    { title: "危険度", value: meters.risk ?? 50, color: "red" },
    { title: "警戒心", value: meters.awareness ?? 50, color: "green" },
  ];

  const tags = currentCard?.tags?.length
    ? currentCard.tags
    : ["高収入", "即日払い", "未経験OK", "履歴書不要"];

  const location = currentCard?.location ?? "都内各所（詳細は連絡時にお伝えします）";
  const shift = currentCard?.shift ?? "自由シフト制 / 1日3時間〜OK";
  const requirements = currentCard?.requirements ?? "18歳以上（高校生不可）・経験不問";
  const benefits = currentCard?.benefits ?? "即日払いOK・交通費支給・服装自由";
  const howToApply = currentCard?.how_to_apply ??
    currentCard?.contact ?? "LINE IDに追加してご連絡ください。ID：@xxxxxxxx";
  const companyMessage = currentCard?.company_message ??
    "とにかく稼ぎたい人、大歓迎！やる気があれば誰でもOK！すぐにお金が欲しい人、まずは気軽に連絡してみてください！";

  const actionIcon = (key: ActionKey) => {
    switch (key) {
      case "apply":
        return <Send className="w-10 h-10" />;
      case "ignore":
        return <ShieldX className="w-10 h-10" />;
      case "report":
        return <Flag className="w-10 h-10" />;
      default:
        return <Send className="w-10 h-10" />;
    }
  };

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

  return (
    <main className="min-h-screen bg-orange-50 text-slate-800 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="flex flex-col gap-6 rounded-2xl bg-white px-6 py-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-orange-500 font-bold text-sm">JOB SAFETY CHECK</p>
            <h1 className="text-3xl font-bold">{mode.title}</h1>
            <p className="mt-2 text-slate-600">{mode.description}</p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="font-bold">レベル {currentIndex + 1}</p>
              <div className="w-40 h-3 bg-orange-100 rounded-full">
                <div className="w-16 h-3 bg-orange-400 rounded-full" />
              </div>
            </div>
            <div className="bg-white border rounded-full px-5 py-2 font-bold shadow-sm">🪙 120</div>
          </div>
        </header>

        <section className="bg-orange-400 text-white rounded-2xl p-6 shadow-md">
          <h2 className="text-2xl font-bold mb-2">
            ⚠ ミッション：求人の内容を確認し、危険度を判断しよう！
          </h2>
          <p className="font-medium">
            {mode.description} 応募・無視・通報の判断を行いましょう。
          </p>
        </section>

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {statusCards.map((status) => (
            <StatusCard key={status.title} {...status} />
          ))}
        </section>

        {!finished && currentCard && (
          <section className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
            <div className="bg-white rounded-2xl p-6 shadow-sm border">
              <h2 className="text-xl font-bold mb-4">💼 求人情報</h2>

              <h3 className="text-2xl font-bold mb-4">{currentCard.title}</h3>

              <div className="flex flex-wrap gap-3 mb-5">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-red-100 text-red-500 font-bold px-4 py-2 rounded-xl"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="border rounded-xl overflow-hidden mb-4">
                <InfoRow
                  label="仕事内容"
                  text={currentCard.body ?? currentCard.description ?? "詳細は不明です。"}
                />
                <InfoRow label="勤務地" text={location} />
                <InfoRow label="勤務時間" text={shift} />
                <InfoRow label="応募資格" text={requirements} />
                <InfoRow label="待遇" text={benefits} />
                <InfoRow label="応募方法" text={howToApply} />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-bold mb-1">🤝 企業からのメッセージ</p>
                <p>{companyMessage}</p>
              </div>
            </div>

            <aside className="bg-emerald-50 rounded-2xl p-6 shadow-sm border border-emerald-100">
              <h2 className="text-xl font-bold text-emerald-700 mb-5">
                🔍 チェックポイント
              </h2>

              <p className="font-bold mb-1">この求人で気になる点は？</p>
              <p className="text-sm text-slate-500 mb-4">（複数選択可）</p>

              <div className="space-y-3">
                {[
                  "時給が高すぎる",
                  "仕事内容が曖昧",
                  "勤務地が不明確",
                  "連絡手段がLINEのみ",
                  "即日払いを強調している",
                  "身分証の提出を求めている",
                  "その他",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-3">
                    <input type="checkbox" className="w-5 h-5 accent-emerald-500" />
                    <span>{item}</span>
                  </label>
                ))}
              </div>

              <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="font-bold mb-2">💡 ヒント</p>
                <p className="text-sm">
                  闇バイトの特徴を思い出してみよう。 「甘い話には裏がある」かも？
                </p>
              </div>
            </aside>
          </section>
        )}

        {!finished && currentCard && (
          <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
          <ResultPanel meters={meters} comment={endingComment} onRestart={handleRestart} />
        )}

        <section className="bg-white rounded-2xl p-5 border shadow-sm flex items-center gap-4">
          <div className="text-4xl">👩‍🏫</div>
          <div>
            <p className="font-bold text-sm mb-1">先生のアドバイス</p>
            <p>
              怪しい求人には共通する特徴があります。冷静にチェックして、正しく判断する力をつけましょう！
            </p>
          </div>
        </section>
      </div>
    </main>
  );

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
}

function StatusCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "red" | "green";
}) {
  const colorMap = {
    blue: "text-blue-500 bg-blue-500",
    red: "text-red-500 bg-red-500",
    green: "text-emerald-500 bg-emerald-500",
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className={`font-bold text-2xl ${colorMap[color].split(" ")[0]}`}>
          {value}
          <span className="text-sm font-normal text-slate-500"> / 100</span>
        </p>
      </div>
      <div className="h-3 bg-slate-100 rounded-full">
        <div
          className={`h-3 rounded-full ${colorMap[color].split(" ")[1]}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function InfoRow({ label, text }: { label: string; text: string }) {
  return (
    <div className="grid grid-cols-[150px_1fr] border-b last:border-b-0">
      <div className="bg-slate-100 p-4 font-bold">{label}</div>
      <div className="p-4">{text}</div>
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
      className={`text-white rounded-2xl p-6 shadow-md transition active:scale-95 ${className}`}
    >
      <div className="flex items-center justify-center gap-4">
        {icon}
        <div className="text-left">
          <p className="text-3xl font-bold">{title}</p>
          <p className="font-bold opacity-90">{subtitle}</p>
        </div>
      </div>
    </button>
  );
}
