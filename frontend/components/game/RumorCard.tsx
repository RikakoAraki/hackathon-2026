import { GameCard } from "@/lib/types";

type Props = {
  card: GameCard;
};

export default function RumorCard({ card }: Props) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-lg">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-sky-100 text-lg font-bold text-sky-700">
          {(card.author ?? "?").slice(0, 1)}
        </div>

        <div>
          <p className="font-semibold">
            {card.author ?? "匿名ユーザー"}
          </p>
          <p className="text-sm text-gray-500">
            @{card.handle ?? "unknown"}
          </p>
        </div>

        <p className="mt-2">
          {card.body ?? card.description ?? ""}
        </p>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold text-slate-900">{card.author}</p>
            {card.verified && (
              <span className="rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">
                公式
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500">
            {card.handle} ・ {card.timeLabel}
          </p>
        </div>
      </div>

      <p className="mb-5 whitespace-pre-wrap leading-7 text-slate-800">
        {card.body}
      </p>

      <div className="flex items-center gap-5 text-sm text-slate-500">
        <span>♡ {card.likes}</span>
        <span>↻ {card.reposts}</span>
      </div>
    </div>
  );
}