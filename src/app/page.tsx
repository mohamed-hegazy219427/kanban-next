// app/page.tsx
"use client";

import KanbanBoard from "../components/KanbanBoard";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-linear-to-bl from-gray-50 via-blue-50 to-indigo-50">
      <KanbanBoard />
    </main>
  );
}
