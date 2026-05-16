"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password })
    });

    setIsSubmitting(false);

    if (!response.ok) {
      setError("Password not recognized. Please try again.");
      return;
    }

    const nextPath = new URLSearchParams(window.location.search).get("next");
    router.replace(nextPath || "/");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 py-10">
      <section className="w-full max-w-md rounded-3xl border border-clinic-line bg-white p-8 shadow-soft">
        <div className="mb-8 flex justify-center">
          <Image src="/assets/yoo-logo.svg" alt="YOO Clinic" width={180} height={90} priority />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-clinic-ink">YOO Quote Builder</h1>
        <p className="mt-2 text-sm leading-6 text-clinic-muted">
          Internal access for preparing patient-facing quotation sheets.
        </p>
        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-sm font-medium text-clinic-ink">Password</span>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="mt-2 w-full rounded-2xl border border-clinic-line px-4 py-3 text-sm outline-none transition focus:border-clinic-teal focus:ring-4 focus:ring-clinic-soft"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? <p className="text-sm font-medium text-red-600">{error}</p> : null}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-clinic-teal px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#127373] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Checking..." : "Enter quote builder"}
          </button>
        </form>
      </section>
    </main>
  );
}
