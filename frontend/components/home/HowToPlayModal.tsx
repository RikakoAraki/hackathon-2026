type HowToPlayModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function HowToPlayModal({
  open,
  onClose,
}: HowToPlayModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25 px-4">
      <div className="w-full max-w-2xl rounded-[28px] border border-[#f3e8d9] bg-white p-7 shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-extrabold tracking-wide text-orange-500">
              HOW TO PLAY
            </p>
            <h2 className="text-3xl font-extrabold text-[#4b1f0f]">遊び方</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full bg-stone-100 px-3 py-1 text-sm font-semibold text-stone-600 transition hover:bg-stone-200"
          >
            閉じる
          </button>
        </div>

        <div className="space-y-4 text-stone-700">
          <div className="rounded-2xl bg-[#fff8ef] p-4">
            <p className="mb-1 font-bold text-[#9c4f18]">1. モードを選ぶ</p>
            <p className="leading-7">
              デマ拡散ストッパー、または闇バイトみきわめシミュレーターを選びます。
            </p>
          </div>

          <div className="rounded-2xl bg-[#f4f9ff] p-4">
            <p className="mb-1 font-bold text-sky-700">2. 情報を読んで判断する</p>
            <p className="leading-7">
              表示された投稿や求人を読み、適切だと思う行動を選びます。
            </p>
          </div>

          <div className="rounded-2xl bg-[#fff8ef] p-4">
            <p className="mb-1 font-bold text-[#9c4f18]">3. 結果を見る</p>
            <p className="leading-7">
              あなたの判断によって、信頼度や安全度などの指標が変化します。
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#f3e8d9] bg-white p-4 text-sm leading-7 text-stone-600">
          正解がひとつに決まらない場面もあります。状況を見ながら、よりよい判断を考えてみましょう。
        </div>
      </div>
    </div>
  );
}