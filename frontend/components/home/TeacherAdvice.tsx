import Image from "next/image";
import { Lightbulb } from "lucide-react";

export default function TeacherAdvice() {
  return (
    <section className="flex items-center gap-3">
      <div className="relative h-[72px] w-[72px] shrink-0">
        <div className="absolute inset-0 rounded-full border border-[#f2e6d5] bg-[#fff7ea] shadow-sm" />
        <Image
            src="/teacher-advisor.png"
            alt="先生アイコン"
            width={54}
            height={54}
            className="absolute -top-1 left-1/2 h-auto w-[54px] -translate-x-1/2 object-contain"
        />
    </div>

      <div className="relative flex-1 rounded-[22px] border border-[#f2e6d5] bg-white px-5 py-3 shadow-[0_6px_16px_rgba(196,149,77,0.05)]">
        <div className="absolute left-[-7px] top-5 h-3.5 w-3.5 rotate-45 border-b border-l border-[#f2e6d5] bg-white" />

        <div className="mb-1 flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-[#d39b2e]" strokeWidth={2.4} />
          <p className="text-[17px] font-extrabold text-[#9c4f18]">
            先生のアドバイス
          </p>
        </div>

        <p className="text-[15px] leading-7 text-stone-700">
          情報を正しく見抜く力は、これからの時代にとってとても大切です。ゲームを通して一緒に身につけていきましょう！
        </p>
      </div>
    </section>
  );
}