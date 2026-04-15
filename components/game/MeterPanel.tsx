import { GameMode, MeterState } from "@/lib/types";

type Props = {
  mode: GameMode;
  meters: MeterState;
};

export default function MeterPanel({ mode, meters }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {mode.meters.map((meter) => {
        const value = meters[meter.key];
        return (
          <div
            key={meter.key}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">{meter.label}</span>
              <span className="font-semibold text-slate-900">{value}</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-slate-800 transition-all duration-300"
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}