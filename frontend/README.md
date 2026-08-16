# TaskFlow frontend

The React single-page application for TaskFlow. It lets authenticated users create team workspaces, manage their members, and organize each team's tasks on a status board.

## What it does

- Registers users and signs them in with JWT authentication.
- Stores the refresh token locally and restores an access token when the app reloads.
- Protects the dashboard and individual team-workspace routes.
- Creates teams and lists the teams associated with the signed-in user.
- Displays team details, members, task statistics, and tasks grouped as **To Do**, **Progress**, **Review**, and **Completed**.
- Lets team administrators add or remove members and create, edit, or delete tasks.
- Supports task assignees, priorities, statuses, descriptions, and due dates.

## Stack

- React 19 and React Router
- Vite 8
- Tailwind CSS 4
- Axios
- Lucide React icons

## Prerequisites

- Node.js 20 or newer
- A running TaskFlow Django API (normally from `../Backend`)

## Run locally

From this directory:

```powershell
npm install
```

Create a local `.env` file with the API server URL. The trailing slash is recommended because the client uses relative API paths.

```env
VITE_URL=http://127.0.0.1:8000/
```

Then start the development server:

```powershell
npm run dev
```

Vite prints the local address in the terminal, usually `http://localhost:5173`.

## Available commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Build an optimized production bundle in `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint across the project. |

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Sign in. |
| `/Register` | Public | Create an account. |
| `/Dashboard` | Authenticated | View and create team workspaces. |
| `/TeamDashboard/:id` | Authenticated | Manage one team's members, task board, and statistics. |

## Authentication and API integration

The client sends credentials to `api/token/` and stores the returned refresh token in `localStorage`. An Axios request interceptor attaches the in-memory access token as a Bearer token. If a protected request receives a 401 response, the client attempts `api/token/refresh/` once and retries the original request.

The Django API must permit the frontend's origin through CORS. The repository backend is configured for `http://localhost:5173`; adjust its CORS settings if Vite runs on another origin or port.

## Project layout

```text
src/
├── Components/  # Navigation and dashboard sections
├── Context/     # Authentication and shared UI state
├── Models/      # Team and task modal dialogs
├── Services/    # Axios API client and token interceptors
├── hooks/       # Context access hook
├── pages/       # Login, registration, dashboard, and team workspace screens
├── App.jsx      # Application routes
└── main.jsx     # React, router, and context providers
```

## Environment files

`.env` files are intentionally ignored by Git. Do not commit API credentials or deployment-specific URLs. For a deployed API, set `VITE_URL` in the environment used by the Vite build.
