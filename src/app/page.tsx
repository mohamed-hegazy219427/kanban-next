// app/page.tsx
"use client";

import { Suspense } from "react";
import KanbanBoard from "../components/KanbanBoard";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center font-bold text-base-content opacity-50">
          Loading board...
        </div>
      }
    >
      <main className="min-h-screen bg-base-100">
        <KanbanBoard />
      </main>
    </Suspense>
  );
}
