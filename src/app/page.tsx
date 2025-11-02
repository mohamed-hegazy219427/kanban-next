// app/page.tsx
"use client";

import { Suspense } from "react";
import KanbanBoard from "../components/KanbanBoard";

export default function HomePage() {
  return (
    <Suspense
      fallback={<div className="p-6 text-center">Loading board...</div>}
    >
      <main className="min-h-screen bg-gray-50">
        <KanbanBoard />
      </main>
    </Suspense>
  );
}
