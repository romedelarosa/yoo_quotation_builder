"use client";

import Image from "next/image";
import type { ReactNode } from "react";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <main className="min-h-screen bg-white text-clinic-ink">
      <header className="no-print sticky top-0 z-20 border-b border-clinic-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <Image src="/assets/yoo-logo.svg" alt="YOO Clinic" width={128} height={64} priority />
            <div className="hidden border-l border-clinic-line pl-4 sm:block">
              <p className="text-sm font-semibold text-clinic-ink">YOO Quote Builder</p>
              <p className="text-xs text-clinic-muted">Internal quotation workspace</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-full border border-clinic-line px-4 py-2 text-sm font-semibold text-clinic-ink transition hover:border-clinic-teal hover:text-clinic-teal"
          >
            Sign out
          </button>
        </div>
      </header>
      {children}
    </main>
  );
}
