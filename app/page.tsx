import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-3xl rounded-[32px] bg-white p-8 shadow-xl">
        <p className="mb-2 text-sm font-semibold tracking-wide text-sky-700">
          HACKATHON PROTOTYPE
        </p>
        <h1 className="mb-4 text-3xl font-bold text-slate-900">
          情報判断シミュレーション
        </h1>
        <p className="mb-8 leading-7 text-slate-700">
          誤情報対応や危険求人の見極めを、体験型ゲームとして学べるプロトタイプです。
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <Link
            href="/rumor"
            className="rounded-[28px] border border-slate-200 bg-sky-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="mb-2 text-sm font-semibold text-sky-700">MODE 01</p>
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              デマ拡散ストッパー
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              SNSの投稿を処理し、信頼・自由・流通のバランスを守るモード
            </p>
          </Link>

          <Link
            href="/yami-baito"
            className="rounded-[28px] border border-slate-200 bg-amber-50 p-6 transition hover:-translate-y-1 hover:shadow-lg"
          >
            <p className="mb-2 text-sm font-semibold text-amber-700">MODE 02</p>
            <h2 className="mb-2 text-xl font-bold text-slate-900">
              闇バイト見極めシミュレーター
            </h2>
            <p className="text-sm leading-6 text-slate-600">
              高収入求人や怪しい勧誘を見て、安全か危険かを判断するモード
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}