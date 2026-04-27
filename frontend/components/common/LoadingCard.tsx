import { ReactNode } from "react";

type LoadingCardProps = {
  title?: string;
  description?: string;
  theme?: "blue" | "orange";
  icon?: ReactNode;
};

export default function LoadingCard({
  title = "読み込み中…",
  description = "ゲームデータを準備しています",
  theme = "blue",
  icon,
}: LoadingCardProps) {
  const isBlue = theme === "blue";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fbf7ef] px-4">
      <div className="w-full max-w-[520px] rounded-[28px] border border-[#f3e8d9] bg-white px-8 py-8 text-center shadow-[0_10px_28px_rgba(196,149,77,0.08)]">
        <div
          className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full ${
            isBlue ? "bg-sky-50" : "bg-amber-50"
          }`}
        >
          <div className="animate-bounce [animation-duration:1.4s]">
            {icon}
          </div>
        </div>

        <h2
          className={`mb-3 text-2xl font-extrabold ${
            isBlue ? "text-sky-700" : "text-orange-500"
          }`}
        >
          {title}
        </h2>

        <p className="mb-5 text-base leading-7 text-stone-600">{description}</p>

        <div className="flex items-center justify-center gap-2">
          <span
            className={`h-3 w-3 animate-pulse rounded-full ${
              isBlue ? "bg-sky-400" : "bg-orange-400"
            }`}
          />
          <span
            className={`h-3 w-3 animate-pulse rounded-full ${
              isBlue ? "bg-sky-300" : "bg-orange-300"
            } [animation-delay:0.2s]`}
          />
          <span
            className={`h-3 w-3 animate-pulse rounded-full ${
              isBlue ? "bg-sky-200" : "bg-orange-200"
            } [animation-delay:0.4s]`}
          />
        </div>
      </div>
    </div>
  );
}