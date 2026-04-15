import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="max-w-xl rounded-[32px] bg-white p-8 shadow-xl">
        <p className="mb-2 text-sm font-semibold tracking-wide text-sky-700">
          HACKATHON PROTOTYPE
        </p>
        <h1 className="mb-4 text-3xl font-bold text-slate-900">
          情報判断シミュレーション
        </h1>
        <p className="mb-6 leading-7 text-slate-700">
          流れてくる情報をどう扱うか。正しさ、自由、信頼、流通のバランスを体験するゲームです。
        </p>

        <Link
          href="/rumor"
          className="inline-flex rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:opacity-90"
        >
          デマ拡散ストッパーを始める
        </Link>
      </div>
    </main>
  );
}