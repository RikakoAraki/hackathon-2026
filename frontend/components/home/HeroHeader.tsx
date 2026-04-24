import Image from "next/image";

type HeroHeaderProps = {
  onOpenHowTo: () => void;
};

export default function HeroHeader({ onOpenHowTo }: HeroHeaderProps) {
  return (
    <div className="relative mb-2 pr-[160px]">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4 pt-3">
          <div className="mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm">
            <span className="text-2xl">🛡️</span>
          </div>

          <div className="min-w-0">
            <p className="mb-1 text-sm font-extrabold tracking-wide text-orange-500">
              JOB SAFETY CHECK
            </p>

            <h1 className="text-[26px] font-extrabold leading-none tracking-[-0.03em] text-[#4b1f0f] sm:text-[40px]">
              情報判断<span className="text-orange-400">シミュレーション</span>
            </h1>
          </div>
        </div>

        <div className="hidden shrink-0 pt-3 sm:block">
          <button
            onClick={onOpenHowTo}
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-800"
          >
            遊び方
          </button>
        </div>
      </div>

      <p className="max-w-[650px] text-[17px] leading-8 text-stone-700">
        誤情報対応や危険求人の見極めを、体験型ゲームとして学べるプロトタイプです。
      </p>

      <div className="pointer-events-none absolute right-0 top-2 hidden md:block">
        <div className="relative h-[132px] w-[132px]">
          <div className="absolute inset-0 rounded-full bg-[#fbf3df]" />
          <Image
            src="/dog-helper.png"
            alt="案内犬"
            width={152}
            height={152}
            className="absolute -top-1 left-[46%] h-auto w-[144px] -translate-x-1/2 object-contain"
            priority
          />
        </div>
      </div>
    </div>
  );
}