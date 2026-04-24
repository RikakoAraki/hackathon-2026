import { GameCard } from "@/lib/types";

type Props = {
  card: GameCard;
};

export default function YamiBaitoCard({ card }: Props) {
  return (
    <div className="rounded-[28px] border border-amber-200 bg-white p-5 shadow-lg space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-amber-600">{card.company}</p>
          <h2 className="mt-1 text-2xl font-bold text-slate-900">{card.title}</h2>
        </div>
        {card.wage && (
          <div className="rounded-2xl bg-amber-50 px-3 py-2 text-right shrink-0">
            <p className="text-xs text-slate-500">報酬</p>
            <p className="font-bold text-amber-700">{card.wage}</p>
          </div>
        )}
      </div>

      {(card.description ?? card.body) && (
        <div>
          <p className="text-xs font-semibold text-slate-500 mb-1">仕事内容</p>
          <p className="leading-7 text-slate-700">{card.description ?? card.body}</p>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        {card.location && (
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500 mb-0.5">勤務地</p>
            <p className="font-medium text-slate-800">{card.location}</p>
          </div>
        )}
        {card.working_hours && (
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500 mb-0.5">勤務時間</p>
            <p className="font-medium text-slate-800">{card.working_hours}</p>
          </div>
        )}
        {card.requirements && (
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500 mb-0.5">応募資格</p>
            <p className="font-medium text-slate-800">{card.requirements}</p>
          </div>
        )}
        {card.benefits && (
          <div className="rounded-2xl bg-slate-50 p-3">
            <p className="text-xs text-slate-500 mb-0.5">待遇</p>
            <p className="font-medium text-slate-800">{card.benefits}</p>
          </div>
        )}
      </div>

      {card.how_to_apply && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm">
          <p className="text-xs text-slate-500 mb-0.5">応募方法</p>
          <p className="font-medium text-slate-800">{card.how_to_apply}</p>
        </div>
      )}

      {card.company_message && (
        <div className="rounded-2xl bg-amber-50 border border-amber-100 p-3 text-sm">
          <p className="text-xs text-amber-600 mb-0.5">企業からのメッセージ</p>
          <p className="text-slate-700 leading-6">{card.company_message}</p>
        </div>
      )}

      {card.tags && card.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {card.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
