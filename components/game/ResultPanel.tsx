import { MeterState } from "@/lib/types";

type Props = {
  meters: MeterState;
  comment: string;
  onRestart: () => void;
};

export default function ResultPanel({ meters, comment, onRestart }: Props) {
  return (
    <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-lg">
      <p className="mb-2 text-sm font-semibold tracking-wide text-sky-700">
        ROUND RESULT
      </p>
      <h2 className="mb-4 text-2xl font-bold text-slate-900">
        ニュース速報：あなたの判断が社会に与えた影響
      </h2>

      <div className="mb-5 grid grid-cols-2 gap-3">
        {Object.entries(meters).map(([key, value]) => (
          <div key={key} className="rounded-2xl bg-slate-50 p-4">
            <div className="text-sm text-slate-500">{key}</div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
          </div>
        ))}
      </div>

      <p className="mb-6 leading-7 text-slate-700">{comment}</p>

      <button
        onClick={onRestart}
        className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90"
      >
        もう一度プレイ
      </button>
    </div>
  );
}