# Kanban-Next
A Kanban-style interactive task management dashboard built with Next.js, React Query, Redux Toolkit, MUI, Tailwind CSS, and DnD Kit.

Live Preview & Demo: [Add your deployed link here]

---

## Features
- Four Kanban columns: **Backlog**, **In Progress**, **Review**, and **Done**
- Create, Edit, Delete tasks with a modal-based UI
- Drag-and-drop tasks between columns (via DnD Kit)
- Pagination per column (via React Query "infinite" queries)
- Full-text search across tasks by title or description
- URL-search parameter integration (`?search=...`)
- React Query caching and automatic invalidation on mutation
- Tailwind + MUI styling, TypeScript, Redux for UI state, json-server mock API for ease of development

---

## Tech Stack
| Layer           | Technology               |
|------------------|--------------------------|
| Framework        | Next.js (App Router)     |
| Language         | TypeScript               |
| UI Library       | Material UI + Tailwind CSS |
| State Management | Redux Toolkit            |
| Server State     | React Query              |
| Drag & Drop      | DnD Kit                  |
| Mock API         | json-server + `db.json`  |

---

## Project Structure
The project is organized into the following folders:

* `src/`:
	+ `app/`: Next.js pages and components
		- `layout.tsx`: Root layout component
		- `providers.tsx`: Redux, Query, and Theme providers
		- `page.tsx`: Home page (KanbanBoard)
	+ `components/`: Reusable UI components
		- `KanbanBoard.tsx`
		- `KanbanColumn.tsx`
		- `TaskCard.tsx`
		- `SearchBar.tsx`
	+ `hooks/`: Custom React hooks
		- `useTasks.ts`: CRUD + pagination for tasks
		- `useSearchQuery.ts`: URL search param logic
	+ `lib/`: Utilities and libraries
		- `api.ts`: Axios instance for API requests
		- `queryClient.ts`: React Query client
	+ `store/`: Redux store and UI slice
		- `index.ts`
	+ `styles/`: Global CSS styles
		- `globals.css`: Tailwind base styles
	+ `db.json`: json-server mock API data

## Getting Started
### Prerequisites
- Node.js v18+
- npm or yarn
- (Optional) `json-server` globally installed


### Setup & Run  
```bash
# 1. Clone this repository
git clone https://github.com/mohamed-hegazy219427/kanban-next.git
cd kanban-next

# 2. Install dependencies
npm install
# or
yarn install

# 3. Start the json-server mock API (in one terminal)
json-server --watch db.json --port 4000

# 4. Add environment variable (in `.env.local`)
NEXT_PUBLIC_API_URL=http://localhost:4000

# 5. Run the dev server
npm run dev
# or
yarn dev

# 6. Visit http://localhost:3000 in your browser
