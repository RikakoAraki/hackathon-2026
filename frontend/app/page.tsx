"use client";

import { useState } from "react";
import HeroHeader from "@/components/home/HeroHeader";
import ModeCard from "@/components/home/ModeCard";
import TeacherAdvice from "@/components/home/TeacherAdvice";
import HowToPlayModal from "@/components/home/HowToPlayModal";

export default function Home() {
  const [isHowToOpen, setIsHowToOpen] = useState(false);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4 py-6">
      <div className="w-full">
        <div className="mx-auto w-full max-w-[930px] rounded-[30px] border border-[#f6eee2] bg-white px-9 py-5 shadow-[0_8px_24px_rgba(196,149,77,0.07)]">
          <HeroHeader onOpenHowTo={() => setIsHowToOpen(true)} />

          <div className="mt-3 grid gap-5 md:grid-cols-2">
            <ModeCard
              modeLabel="MODE 01"
              title="デマ拡散ストッパー"
              description="SNSで流れてくる「それっぽい投稿」を見分け、拡散するか無視するか判断する練習します。"
              href="/rumor"
              theme="blue"
            />

            <ModeCard
              modeLabel="MODE 02"
              title="闇バイトみきわめシミュレーター"
              description="求人票の内容を読み、応募するか無視するかを選ぶ練習をします。"
              href="/yami-baito"
              theme="orange"
            />
          </div>
        </div>

        <div className="mx-auto mt-5 w-full max-w-[940px] px-2">
          <TeacherAdvice />
        </div>
      </div>

      <HowToPlayModal
        open={isHowToOpen}
        onClose={() => setIsHowToOpen(false)}
      />
    </main>
  );
}