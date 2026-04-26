import Image from "next/image";
import { useMemo } from "react";
import { GameCard } from "@/lib/types";

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

type Props = {
  card: GameCard & { is_verified?: boolean; handle?: string };
};

export default function RumorCard({ card }: Props) {
  const bgColor = useMemo(() => BG_COLORS[seededIndex(card.id + "bg", BG_COLORS.length)], [card.id]);
  const fallbackHandle = useMemo(() => HANDLES[seededIndex(card.id + "handle", HANDLES.length)], [card.id]);
  const likes   = useMemo(() => card.likes   ?? seededNum(card.id + "l", 12, 980), [card.id, card.likes]);
  const reposts = useMemo(() => card.reposts ?? seededNum(card.id + "r", 3, 340),  [card.id, card.reposts]);
  const comments = useMemo(() => seededNum(card.id + "c", 1, 120), [card.id]);

  const isVerified = card.is_verified ?? card.verified ?? false;
  const authorName = card.author ?? "匿名ユーザー";
  const handle = card.handle ?? fallbackHandle;
  const timeLabel = card.timeLabel ?? `${seededNum(card.id + "t", 1, 59)}分前`;

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white shadow-lg space-y-4 overflow-hidden">
      {/* ヘッダー */}
      <div className="flex items-start gap-3 px-5 pt-5">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor} flex-shrink-0`}>
          <Image src="/user-icon.png" alt="user" width={28} height={28} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-bold text-slate-900">{authorName}</p>
            {isVerified && (
              <span
                className="flex items-center justify-center h-5 w-5 rounded-full bg-sky-500 text-white text-xs flex-shrink-0"
                title="公式アカウント"
              >
                ✓
              </span>
            )}
          </div>
          <p className="text-sm text-slate-400">@{handle} · {timeLabel}</p>
        </div>
      </div>

      {/* 本文 */}
      <div className="px-5">
        <p className="whitespace-pre-wrap leading-7 text-slate-800 text-[15px]">
          {card.body ?? card.description ?? ""}
        </p>
      </div>

      {/* リアクションバー */}
      <div className="flex items-center gap-6 px-5 pb-5 text-sm text-slate-400 border-t border-slate-100 pt-3">
        <span className="flex items-center gap-1.5 hover:text-sky-500 cursor-default">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {comments}
        </span>
        <span className="flex items-center gap-1.5 hover:text-green-500 cursor-default">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {reposts}
        </span>
        <span className="flex items-center gap-1.5 hover:text-pink-500 cursor-default">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          {likes}
        </span>
      </div>
    </div>
  );
}
