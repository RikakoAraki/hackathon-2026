import { GameCard } from "@/lib/types";

type Props = {
  card: GameCard;
};

export default function YamiBaitoCard({ card }: Props) {
  return (
    <div className="rounded-[28px] border border-amber-200 bg-white p-5 shadow-lg">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-600">{card.company}</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">{card.title}</h2>
        </div>
        <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right">
          <p className="text-xs text-slate-500">給与</p>
          <p className="font-bold text-amber-700">{card.wage}</p>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">勤務地</p>
          <p className="font-medium text-slate-800">{card.location}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <p className="text-slate-500">シフト</p>
          <p className="font-medium text-slate-800">{card.shift}</p>
        </div>
      </div>

      <p className="mb-4 leading-7 text-slate-700">{card.body}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {card.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
        <p className="text-slate-500">応募窓口</p>
        <p className="font-medium text-slate-800">{card.contact}</p>
      </div>
    </div>
  );
}