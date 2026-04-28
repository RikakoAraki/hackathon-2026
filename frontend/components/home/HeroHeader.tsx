import Image from "next/image";
import { ShieldCheck } from "lucide-react";

type HeroHeaderProps = {
  onOpenHowTo: () => void;
};

export default function HeroHeader({ onOpenHowTo }: HeroHeaderProps) {
  return (
    <div className="relative mb-8 pr-[160px]">
      <div className="mb-2 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-start gap-4 pt-3">
          <div className="mt-7 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-orange-400 shadow-sm">
            <ShieldCheck className="mt-1 h-7 w-7 text-white" strokeWidth={2.4} />
            </div>

          <div className="min-w-0">
            <p className="mt-4 mb-1 text-sm font-extrabold tracking-wide text-orange-500">
              Information Literacy Simulation
            </p>

            <h1 className="mt-4 text-[26px] font-extrabold leading-none tracking-[-0.03em] text-[#4b1f0f] sm:text-[40px]">
              情報判断<span className="text-orange-400">シミュレーション</span>
            </h1>
          </div>
        </div>

        
      </div>

      <p className="mt-6 mb-2 max-w-[650px] text-[17px] leading-8 text-stone-700">
        誤情報への対応や危険な求人のみきわめ方を、体験型ゲームで学べる！
        </p>

      <div className="pointer-events-none absolute right-5 top-10 hidden md:block">
        <div className="relative h-[132px] w-[132px]">
          <div className="absolute inset-0 rounded-full bg-[#fbf3df]" />
          <Image
            src="/dog-helper.png"
            alt="案内犬"
            width={176}
            height={176}
            className="absolute top-3 left-[50%] h-auto w-[164px] -translate-x-1/2 object-contain"
            priority
          />
        </div>
      </div>
      <div className="absolute right-6 top-1 hidden sm:block">
        <button
            onClick={onOpenHowTo}
            className="text-sm font-semibold text-slate-500 transition hover:text-slate-800"
        >
            遊び方
        </button>
        </div>
    </div>
  );
}