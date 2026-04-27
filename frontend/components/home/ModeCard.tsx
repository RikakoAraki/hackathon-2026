import Link from "next/link";
import { AlertTriangle, Shield, ArrowRight } from "lucide-react";

type ModeCardProps = {
  modeLabel: string;
  title: string;
  description: string;
  href: string;
  theme: "blue" | "orange";
};

export default function ModeCard({
  modeLabel,
  title,
  description,
  href,
  theme,
}: ModeCardProps) {
  const isBlue = theme === "blue";

  return (
    <Link
      href={href}
      className={`group relative block min-h-[168px] rounded-[24px] border px-5 py-4 transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        isBlue
          ? "border-[#cfe7fb] bg-[#eef7ff]"
          : "border-[#f1db97] bg-[#fff9e9]"
      }`}
    >
      <div className="mb-2 flex items-start justify-between gap-3">
        <span
          className={`inline-flex rounded-full px-3 py-1.5 text-sm font-extrabold ${
            isBlue
              ? "bg-[#dceefe] text-sky-600"
              : "bg-[#fff0c7] text-orange-500"
          }`}
        >
          {modeLabel}
        </span>

        <div
          className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full ${
            isBlue ? "bg-[#dfefff]" : "bg-[#fff1c9]"
          }`}
        >
          {isBlue ? (
            <Shield className="h-7 w-7 text-sky-500" strokeWidth={2.2} />
          ) : (
            <AlertTriangle
              className="h-7 w-7 text-orange-400"
              strokeWidth={2.2}
            />
          )}
        </div>
      </div>

      <h2
        className={`mb-2 text-[20px] font-extrabold leading-snug ${
          isBlue ? "text-slate-900" : "text-[#4b1f0f]"
        }`}
      >
        {title}
      </h2>

      <p className="max-w-[360px] text-[15px] leading-7 text-slate-600">
        {description}
      </p>

      <div className="pointer-events-none absolute bottom-3 right-3 opacity-0 transition group-hover:translate-x-1 group-hover:opacity-100">
        <ArrowRight className="h-4 w-4 text-slate-400" />
      </div>
    </Link>
  );
}