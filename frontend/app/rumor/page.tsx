"use client";

import { useMemo, useState } from "react";
import MeterPanel from "@/components/game/MeterPanel";
import ResultPanel from "@/components/game/ResultPanel";
import RumorCard from "@/components/game/RumorCard";
import { rumorMode } from "@/data/rumorMode";
import {
  applyEffect,
  createInitialMeters,
  getEndingComment,
} from "@/lib/gameEngine";
import { ActionKey, MeterState } from "@/lib/types";

export default function RumorPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meters, setMeters] = useState<MeterState>(
    createInitialMeters(rumorMode)
  );
  const [history, setHistory] = useState<{ cardId: string; action: ActionKey }[]>(
    []
  );

  const finished = currentIndex >= rumorMode.cards.length;
  const currentCard = rumorMode.cards[currentIndex];

  const endingComment = useMemo(() => getEndingComment(meters), [meters]);

  const handleAction = (action: ActionKey) => {
    if (!currentCard) return;

    const effect = currentCard.effects[action];
    const nextMeters = applyEffect(meters, effect, rumorMode);

    setMeters(nextMeters);
    setHistory((prev) => [...prev, { cardId: currentCard.id, action }]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setMeters(createInitialMeters(rumorMode));
    setHistory([]);
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6 rounded-[28px] bg-sky-600 p-6 text-white shadow-lg">
          <p className="mb-2 text-sm font-semibold tracking-wide">TIMELINE MODERATION</p>
          <h1 className="mb-2 text-3xl font-bold">{rumorMode.title}</h1>
          <p className="text-sm leading-6 text-sky-50">{rumorMode.description}</p>
        </header>

        <div className="mb-6">
          <MeterPanel mode={rumorMode} meters={meters} />
        </div>

        {!finished && currentCard && (
          <>
            <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
              <span>
                投稿 {currentIndex + 1} / {rumorMode.cards.length}
              </span>
              <span>あなたはSNS運営チームです</span>
            </div>

            <RumorCard card={currentCard} />

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {rumorMode.actions.map((action) => (
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
          <ResultPanel
            meters={meters}
            comment={endingComment}
            onRestart={handleRestart}
          />
        )}
      </div>
    </main>
  );
}