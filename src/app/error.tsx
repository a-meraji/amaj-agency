"use client";

export default function ContentError({ reset }: { reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 pt-24 text-center text-white">
      <h1 className="text-2xl font-bold">This page is temporarily unavailable</h1>
      <button type="button" onClick={reset} className="mt-5 rounded-lg border border-periwinkle px-4 py-2">
        Try again
      </button>
    </main>
  );
}
