# 📋 Kanban-Next (Senior Edition)

A high-performance, senior-level Kanban-style interactive task management dashboard. Built with **Next.js 16 (App Router)**, **React Query**, **Redux Toolkit**, **MUI**, and **DnD Kit Sortable**.

![Kanban Dashboard Preview](https://via.placeholder.com/1200x600?text=Kanban+Board+Preview)

---

## 🚀 Advanced Features

- **🔄 Persistent In-Column Sorting**: Integrated `@dnd-kit/sortable` for fluid reordering within the same column and between columns.
- **⚡ Optimistic UI Updates**: Instant feedback on task moves and deletions using React Query's `onMutate` patterns.
- **🏗️ Modern Architecture**:
  - **Centralized Type System**: Type-safe development with a dedicated `src/types` layer.
  - **API Interceptors**: Global Axios interceptors for centralized error logging and handling.
  - **Infinite Scrolling**: Paginated data fetching per column to handle large datasets efficiently.
- **🎨 Premium UI/UX**:
  - **Loading Skeletons**: Reduced layout shift using themed MUI Skeletons.
  - **Glassmorphism & Gradients**: Subtle, modern aesthetic with backdrop blurs and linear gradients.
  - **Transition Effects**: Smooth CSS transitions on drag-over and state changes.
- **🔍 Deep Search**: URL-synced search allows sharing filtered views effortlessly.
- **♿ Accessibility**: Semantic HTML, ARIA labels, and keyboard-friendly interactions.

---

## 🛠️ Tech Stack

| Layer                | Technology                                |
| :------------------- | :---------------------------------------- |
| **Framework**        | Next.js 16 (App Router)                   |
| **Language**         | TypeScript                                |
| **State Management** | Redux Toolkit (UI) + React Query (Server) |
| **Styling**          | MUI v7 + Tailwind CSS v4                  |
| **Drag & Drop**      | DnD Kit (Core + Sortable)                 |
| **Networking**       | Axios + Interceptors                      |
| **Mock API**         | JSON-Server                               |

---

## 📁 Project Structure

```text
src/
├── app/               # Next.js App Router (Layouts, Providers, Pages)
├── components/        # Reusable UI (Board, Columns, Cards, Dialogs)
├── hooks/             # Custom Logic (useTasks, useSearchQuery)
├── lib/               # Utilities (API client, QueryClient setup)
├── store/             # Global UI State (Redux Toolkit)
├── types/             # Centralized TypeScript Definitions
└── styles/            # CSS Configuration (Tailwind, Globals)
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
   The easiest way to run both the frontend and the mock backend server:

   ```bash
   npm run dev:all
   ```

3. **Manual Run (Separate Terminals)**

   **Terminal 1 (Backend Server):**

   ```bash
   # Use npx if json-server is not installed globally
   npx json-server --watch db.json --port 4000
   ```

   _Note: If you have issues with global installation, `npm run server` also works._

   **Terminal 2 (Frontend App):**

   ```bash
   npm run dev
   ```

4. **Visit** [http://localhost:3000](http://localhost:3000)

---

## 🧪 Verification & Linting

To ensure code quality and consistency:

```bash
npm run lint
```

---

## 📝 License

MIT
