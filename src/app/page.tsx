// app/page.tsx
"use client";

import { Suspense } from "react";
import KanbanBoard from "../components/KanbanBoard";

import { Box } from "@mui/material";

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <Box className="p-6 text-center font-bold text-base-content opacity-50">
          Loading board...
        </Box>
      }
    >
      <Box component="main" className="min-h-screen bg-base-100">
        <KanbanBoard />
      </Box>
    </Suspense>
  );
}
