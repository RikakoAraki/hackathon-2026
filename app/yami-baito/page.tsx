"use client";

import { useMemo, useState } from "react";
import MeterPanel from "@/components/game/MeterPanel";
import ResultPanel from "@/components/game/ResultPanel";
import YamiBaitoCard from "@/components/game/YamiBaitoCard";
import { yamiBaitoMode } from "@/data/yamiBaitoMode";
import {
  applyEffect,
  createInitialMeters,
  getEndingComment,
} from "@/lib/gameEngine";
import { ActionKey, MeterState } from "@/lib/types";

export default function YamiBaitoPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [meters, setMeters] = useState<MeterState>(
    createInitialMeters(yamiBaitoMode)
  );
  const [history, setHistory] = useState<{ cardId: string; action: ActionKey }[]>(
    []
  );

  const finished = currentIndex >= yamiBaitoMode.cards.length;
  const currentCard = yamiBaitoMode.cards[currentIndex];

  const endingComment = useMemo(
    () => getEndingComment(yamiBaitoMode, meters),
    [meters]
  );

  const handleAction = (action: ActionKey) => {
    if (!currentCard) return;

    const effect = currentCard.effects[action] ?? {};
    const nextMeters = applyEffect(meters, effect, yamiBaitoMode);

    setMeters(nextMeters);
    setHistory((prev) => [...prev, { cardId: currentCard.id, action }]);
    setCurrentIndex((prev) => prev + 1);
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setMeters(createInitialMeters(yamiBaitoMode));
    setHistory([]);
  };

  return (
    <main className="min-h-screen bg-amber-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6 rounded-[28px] bg-amber-500 p-6 text-white shadow-lg">
          <p className="mb-2 text-sm font-semibold tracking-wide">JOB SAFETY CHECK</p>
          <h1 className="mb-2 text-3xl font-bold">{yamiBaitoMode.title}</h1>
          <p className="text-sm leading-6 text-amber-50">
            {yamiBaitoMode.description}
          </p>
        </header>

        <div className="mb-6">
          <MeterPanel mode={yamiBaitoMode} meters={meters} />
        </div>

        {!finished && currentCard && (
          <>
            <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
              <span>
                求人 {currentIndex + 1} / {yamiBaitoMode.cards.length}
              </span>
              <span>あなたは応募を検討中の学生です</span>
            </div>

            <YamiBaitoCard card={currentCard} />

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {yamiBaitoMode.actions.map((action) => (
                <button
                  key={action.key}
                  onClick={() => handleAction(action.key)}
                  className="rounded-2xl border border-amber-200 bg-white px-4 py-3 font-medium text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-amber-50"
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