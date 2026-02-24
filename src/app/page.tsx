// app/page.tsx
"use client";

import { Suspense } from "react";
import KanbanBoard from "../components/KanbanBoard";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-base-100 flex flex-col items-center justify-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-sm font-black uppercase tracking-[0.3em] opacity-20">
            Initializing Board
          </p>
        </div>
      }
    >
      <main className="min-h-screen bg-base-100">
        <KanbanBoard />
      </main>
    </Suspense>
  );
}
