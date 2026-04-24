import Image from "next/image";
import { useMemo } from "react";
import { GameCard } from "@/lib/types";

const BG_COLORS = [
  "bg-red-200",
  "bg-orange-200",
  "bg-yellow-200",
  "bg-green-200",
  "bg-teal-200",
  "bg-blue-200",
  "bg-indigo-200",
  "bg-purple-200",
  "bg-pink-200",
];

const USERS: { name: string; handle: string }[] = [
  { name: "さくら🌸",    handle: "sakura_days" },
  { name: "しょーた",    handle: "shota_log" },
  { name: "はなちゃん",  handle: "hana_chan22" },
  { name: "たろうくん",  handle: "taro_kun_jp" },
  { name: "あいみ",      handle: "aimi_note" },
  { name: "けんじ",      handle: "kenji_post" },
  { name: "めぐりん",    handle: "megrin_SNS" },
  { name: "ゆうき🎮",   handle: "yuuki_gamer" },
  { name: "りなぴ",      handle: "rina_pi_pi" },
  { name: "ひろくん",    handle: "hiro_daily" },
];

function seededIndex(seed: string, max: number) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return hash % max;
}

type Props = {
  card: GameCard;
};

export default function RumorCard({ card }: Props) {
  const bgColor = useMemo(() => BG_COLORS[seededIndex(card.id + "bg", BG_COLORS.length)], [card.id]);
  const user = useMemo(() => USERS[seededIndex(card.id + "user", USERS.length)], [card.id]);

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg">
      <div className="mb-4 flex items-start gap-3">
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${bgColor} flex-shrink-0`}>
          <Image src="/user-icon.png" alt="user" width={28} height={28} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-slate-900">{user.name}</p>
            {card.verified && (
              <span className="rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">
                公式
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            @{user.handle} ・ {card.timeLabel}
          </p>
        </div>
      </div>

      <p className="mb-5 whitespace-pre-wrap leading-7 text-slate-800">
        {card.body ?? card.description ?? ""}
      </p>

      <div className="flex items-center gap-5 text-sm text-slate-500">
        <span>♡ {card.likes}</span>
        <span>↻ {card.reposts}</span>
      </div>
    </div>
  );
}