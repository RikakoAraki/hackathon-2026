"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import RumorCard from "@/components/game/RumorCard";
import LoadingCard from "@/components/common/LoadingCard";
import { Search } from "lucide-react";
import { ActionKey, RumorCard as RumorCardType, RumorGameMode } from "@/lib/types";

type HistoryEntry = { cardId: string; action: ActionKey };

export default function RumorPage() {
  const [mode, setMode] = useState<RumorGameMode | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMode = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"}/api/generator/game-mode`, {
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

  const correctCount = finished
    ? history.filter((h, i) => h.action === mode.cards[i].correct_action).length
    : 0;
  const score = finished ? Math.round((correctCount / mode.cards.length) * 100) : 0;

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6 rounded-[28px] bg-sky-600 p-6 text-white shadow-lg">
          <p className="mb-2 text-sm font-semibold tracking-wide">TIMELINE MODERATION</p>
          <h1 className="mb-2 text-3xl font-bold">{mode.title}</h1>
          <p className="text-sm leading-6 text-sky-50">{mode.description}</p>
        </header>

        {!finished && currentCard && (
          <>
            <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
              <span>投稿 {currentIndex + 1} / {mode.cards.length}</span>
              <span>あなたはSNS運営チームです</span>
            </div>

            <RumorCard card={currentCard as any} />

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {mode.actions.map((action) => (
                <button
                  key={action.key}
                  onClick={() => handleAction(action.key)}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
                >
                  {action.label}
                </button>
              ))}
            </div>
          </>
        )}

        {finished && (
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg">
            <p className="mb-2 text-sm font-semibold tracking-wide text-sky-700">RESULT</p>
            <p className="mb-1 text-5xl font-bold text-slate-900">{score}<span className="text-2xl font-normal text-slate-500"> / 100</span></p>
            <p className="mb-6 text-slate-500">{correctCount} / {mode.cards.length} 問正解</p>

            <div className="space-y-3 mb-6">
              {mode.cards.map((card, i) => {
                const taken = history[i]?.action;
                const correct = card.correct_action;
                const isCorrect = taken === correct;
                const takenLabel = mode.actions.find((a) => a.key === taken)?.label ?? taken;
                const correctLabel = mode.actions.find((a) => a.key === correct)?.label ?? correct;
                return (
                  <div key={card.id} className={`rounded-2xl p-4 text-sm ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                        {isCorrect ? "✓ 正解" : "✗ 不正解"}
                      </span>
                      <span className="text-slate-500">あなた: {takenLabel}</span>
                      {!isCorrect && <span className="text-slate-500">→ 正解: {correctLabel}</span>}
                    </div>
                    <p className="mb-2 rounded-xl bg-white border border-slate-200 px-3 py-2 text-slate-700 leading-6 text-xs">
                      {card.body}
                    </p>
                    <p className="text-slate-600 leading-6">{card.reason}</p>
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


// "use client";

// import { useMemo, useState } from "react";
// import MeterPanel from "@/components/game/MeterPanel";
// import ResultPanel from "@/components/game/ResultPanel";
// import RumorCard from "@/components/game/RumorCard";
// import { rumorMode } from "@/data/rumorMode";
// import {
//   applyEffect,
//   createInitialMeters,
//   getEndingComment,
// } from "@/lib/gameEngine";
// import { ActionKey, MeterState } from "@/lib/types";

// export default function RumorPage() {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [meters, setMeters] = useState<MeterState>(
//     createInitialMeters(rumorMode)
//   );
//   const [history, setHistory] = useState<{ cardId: string; action: ActionKey }[]>(
//     []
//   );

//   const finished = currentIndex >= rumorMode.cards.length;
//   const currentCard = rumorMode.cards[currentIndex];

//   const endingComment = useMemo(() => getEndingComment(meters), [meters]);

//   const handleAction = (action: ActionKey) => {
//     if (!currentCard) return;

//     const effect = currentCard.effects[action];
//     const nextMeters = applyEffect(meters, effect, rumorMode);

//     setMeters(nextMeters);
//     setHistory((prev) => [...prev, { cardId: currentCard.id, action }]);
//     setCurrentIndex((prev) => prev + 1);
//   };

//   const handleRestart = () => {
//     setCurrentIndex(0);
//     setMeters(createInitialMeters(rumorMode));
//     setHistory([]);
//   };

//   return (
//     <main className="min-h-screen bg-slate-100">
//       <div className="mx-auto max-w-3xl px-4 py-8">
//         <header className="mb-6 rounded-[28px] bg-sky-600 p-6 text-white shadow-lg">
//           <p className="mb-2 text-sm font-semibold tracking-wide">TIMELINE MODERATION</p>
//           <h1 className="mb-2 text-3xl font-bold">{rumorMode.title}</h1>
//           <p className="text-sm leading-6 text-sky-50">{rumorMode.description}</p>
//         </header>

//         <div className="mb-6">
//           <MeterPanel mode={rumorMode} meters={meters} />
//         </div>

//         {!finished && currentCard && (
//           <>
//             <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
//               <span>
//                 投稿 {currentIndex + 1} / {rumorMode.cards.length}
//               </span>
//               <span>あなたはSNS運営チームです</span>
//             </div>

//             <RumorCard card={currentCard} />

//             <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
//               {rumorMode.actions.map((action) => (
//                 <button
//                   key={action.key}
//                   onClick={() => handleAction(action.key)}
//                   className="rounded-2xl border border-slate-200 bg-white px-4 py-3 font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50"
//                 >
//                   {action.label}
//                 </button>
//               ))}
//             </div>
//           </>
//         )}

//         {finished && (
//           <ResultPanel
//             meters={meters}
//             comment={endingComment}
//             onRestart={handleRestart}
//           />
//         )}
//       </div>
//     </main>
//   );
// }
