import Link from "next/link";
import { Cloud, Rss, ArrowUpRight } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import type { ComponentType, ReactNode } from "react";

type AuthLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

const SIGNALS: {
  name: string;
  desc: string;
  icon: ComponentType<{ size?: number }>;
  accent: string;
}[] = [
  {
    name: "Weather",
    desc: "A clear view of the day",
    icon: Cloud,
    accent: "text-amber-400 bg-amber-400/10",
  },
  {
    name: "GitHub",
    desc: "Your work, in context",
    icon: FaGithub,
    accent: "text-violet-300 bg-violet-300/10",
  },
  {
    name: "RSS feeds",
    desc: "Stories worth keeping up with",
    icon: Rss,
    accent: "text-orange-400 bg-orange-400/10",
  },
];

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500 text-sm font-bold text-white">
        e_
      </span>
      <span className="text-[15px] font-semibold text-white">
        Epitech Dashboard
      </span>
    </Link>
  );
}

export default function AuthLayout({
  eyebrow,
  title,
  description,
  children,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-black">
      <aside className="hidden w-1/2 max-w-[720px] flex-col justify-between bg-zinc-900 p-14 lg:flex">
        <div className="flex flex-col gap-8">
          <Logo />

          <div className="flex flex-col gap-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-300">
              One personal workspace
            </p>
            <h1 className="text-[38px] font-bold leading-[1.16] text-white">
              A little more clarity.
              <br />
              All in one place.
            </h1>
            <p className="text-[15px] leading-relaxed text-zinc-400">
              Weather, repositories, and the feeds you follow. A dashboard
              arranged around your day.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-2xl bg-zinc-800 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-600">
              Your signal, organized
            </p>
            {SIGNALS.map((signal) => {
              const Icon = signal.icon;
              return (
                <div
                  key={signal.name}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-3 ${signal.accent}`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={20} />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {signal.name}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        {signal.desc}
                      </p>
                    </div>
                  </div>
                  <ArrowUpRight size={16} />
                </div>
              );
            })}
          </div>
        </div>

        <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-600">
          Epitech / Personal dashboard
        </p>
      </aside>

      <main className="flex flex-1 items-center justify-center px-6 py-14 lg:px-24">
        <div className="flex w-full max-w-[360px] flex-col gap-7">
          <div className="lg:hidden">
            <Logo />
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-300">
              {eyebrow}
            </p>
            <h2 className="text-[30px] font-bold text-white">{title}</h2>
            <p className="text-sm text-zinc-400">{description}</p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}
