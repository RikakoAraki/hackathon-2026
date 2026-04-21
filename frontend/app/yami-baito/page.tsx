"use client";

import { useEffect, useMemo, useState } from "react";
import MeterPanel from "@/components/game/MeterPanel";
import ResultPanel from "@/components/game/ResultPanel";
import YamiBaitoCard from "@/components/game/YamiBaitoCard";
import {
  applyEffect,
  createInitialMeters,
  getEndingComment,
} from "@/lib/gameEngine";
import { ActionKey, MeterState, GameMode } from "@/lib/types";

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

  if (loading || !mode) {
    return (
      <main className="min-h-screen bg-amber-50">
        <div className="mx-auto max-w-3xl px-4 py-8">
          <div className="rounded-2xl bg-white p-6 shadow">読み込み中...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <header className="mb-6 rounded-[28px] bg-amber-500 p-6 text-white shadow-lg">
          <p className="mb-2 text-sm font-semibold tracking-wide">JOB SAFETY CHECK</p>
          <h1 className="mb-2 text-3xl font-bold">{mode.title}</h1>
          <p className="text-sm leading-6 text-amber-50">{mode.description}</p>
        </header>

        <div className="mb-6">
          <MeterPanel mode={mode} meters={meters} />
        </div>

        {!finished && currentCard && (
          <>
            <div className="mb-4 flex items-center justify-between text-sm text-slate-500">
              <span>
                求人 {currentIndex + 1} / {mode.cards.length}
              </span>
              <span>あなたは応募を検討中の学生です</span>
            </div>

            <YamiBaitoCard card={currentCard} />

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {mode.actions.map((action) => (
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