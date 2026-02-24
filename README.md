# 📋 Kanban-Next (Senior Edition)

A high-performance, senior-level Kanban-style interactive task management dashboard. Built with **Next.js 16 (App Router)**, **React Query**, **Redux Toolkit**, **DaisyUI**, and **DnD Kit Sortable**.

---

## 🚀 Advanced Features

- **🔄 Persistent In-Column Sorting**: Integrated `@dnd-kit/sortable` for fluid reordering within and between columns.
- **⚡ Optimistic UI Updates**: Instant feedback on task moves and deletions using React Query's `onMutate` patterns.
- **🏗️ Modern Architecture**:
  - **Centralized Type System**: Type-safe development with a dedicated `src/types` layer.
  - **API Interceptors**: Global Axios interceptors for centralized error logging and handling.
  - **Infinite Scrolling**: Paginated data fetching per column to handle large datasets efficiently.
- **🎨 Premium UI/UX**:
  - **30+ DaisyUI Themes**: Switch between themes instantly via the built-in theme selector.
  - **Loading Skeletons**: Reduced layout shift using DaisyUI skeleton components.
  - **Transition Effects**: Smooth CSS transitions on drag-over and state changes.
- **🔍 Deep Search**: URL-synced search allows sharing filtered views effortlessly.
- **♿ Accessibility**: Semantic HTML, ARIA labels, focus trapping via `@mui/base`, and keyboard-friendly interactions.

---

## 🛠️ Tech Stack

| Layer                | Technology                                |
| :------------------- | :---------------------------------------- |
| **Framework**        | Next.js 16 (App Router)                   |
| **Language**         | TypeScript                                |
| **State Management** | Redux Toolkit (UI) + React Query (Server) |
| **Styling**          | DaisyUI v5 + Tailwind CSS v4              |
| **Headless UI**      | @mui/base (Modal)                         |
| **Drag & Drop**      | DnD Kit (Core + Sortable)                 |
| **Networking**       | Axios + Interceptors                      |
| **Mock API**         | JSON-Server                               |

---

## 🎨 UI Architecture

The UI follows a **headless + utility-first** approach:

```
┌─────────────────────────────────────────────────────┐
│  @mui/base (Logic & Accessibility)                  │
│  ├── Modal — Focus trapping, backdrop, open/close   │
│  └── Used in: TaskFormDialog, ConfirmDialog         │
├─────────────────────────────────────────────────────┤
│  DaisyUI (Visual Design System)                     │
│  ├── Components: btn, card, input, textarea, badge  │
│  │                modal-box, dropdown, skeleton     │
│  ├── Theming:    data-theme attribute (30+ themes)  │
│  └── Layout:     Tailwind CSS utility classes       │
├─────────────────────────────────────────────────────┤
│  Semantic HTML                                      │
│  ├── <div>, <h1>–<h3>, <p>, <button>, <input>      │
│  └── Inline SVG icons (no icon library dependency)  │
└─────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
page.tsx
└── KanbanBoard
    ├── SearchBar          — DaisyUI input + inline SVG
    ├── ThemeSelector      — DaisyUI dropdown
    └── KanbanColumn (×4)
        ├── TaskCard (×N)  — DaisyUI card + inline SVG actions
        ├── CreateTaskDialog → TaskFormDialog (@mui/base Modal)
        ├── EditTaskDialog   → TaskFormDialog (@mui/base Modal)
        └── ConfirmDialog    (@mui/base Modal)
```

### Design Principles

1. **Zero MUI Material**: No `@mui/material` dependency — all styling is DaisyUI/Tailwind.
2. **Headless modals**: `@mui/base/Modal` provides focus trapping and accessibility without visual opinions.
3. **Inline SVG icons**: Lightweight, no external icon library. Icons are embedded directly in components.
4. **Theme-agnostic**: All colors use DaisyUI semantic tokens (`base-content`, `primary`, `error`, etc.) ensuring automatic compatibility with all 30+ themes.

---

## 📁 Project Structure

```text
src/
├── app/               # Next.js App Router (Layouts, Providers, Pages)
├── components/        # Reusable UI (Board, Columns, Cards, Dialogs)
├── hooks/             # Custom Logic (useTasks, useSearchQuery)
├── lib/               # Utilities (API client, QueryClient setup)
├── store/             # Global UI State (Redux Toolkit)
└── types/             # Centralized TypeScript Definitions
```

---

## 🏃 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn

### Installation & Run

1. **Clone & Install**

   ```bash
   git clone https://github.com/mohamed-hegazy219427/kanban-next.git
   cd kanban-next
   npm install
   ```

2. **Run All-in-One (Recommended)**

   ```bash
   npm run dev:all
   ```

3. **Manual Run (Separate Terminals)**

   **Terminal 1 (Backend Server):**

   ```bash
   npx json-server --watch db.json --port 4000
   ```

   **Terminal 2 (Frontend App):**

   ```bash
   npm run dev
   ```

4. **Visit** [http://localhost:3000](http://localhost:3000)

---

## 🧪 Verification & Linting

```bash
npm run lint
npm run build
```

---

## 📝 License

MIT
