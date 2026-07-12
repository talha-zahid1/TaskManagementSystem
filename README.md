# Task Management System

A full-stack task-management application for creating teams, managing members, assigning tasks, and tracking task statistics.

## Tech stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Axios
- **Backend:** Django, Django REST Framework, Simple JWT
- **Database:** SQLite (development default)

## Features

- User registration and JWT-based sign-in
- Team creation, membership management, and role-based administration
- Task creation, editing, deletion, assignment, priority, status, and due dates
- Global and team-level task statistics, including overdue and high-priority counts
- Protected dashboard and team workspace routes

## Project structure

```text
TaskManagementsystem/
├── Backend/       # Django REST API
└── frontend/      # React/Vite client
```

## Run locally

Start the backend first:

```powershell
cd Backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `Backend/.env` with the required Django settings:

```env
SECRET_KEY=replace-with-a-long-random-secret
DEBUG=True
```

Then prepare and run the API:

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000`.

In a second terminal, run the frontend:

```powershell
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal (normally `http://localhost:5173`). The default frontend configuration connects to `http://127.0.0.1:8000`.

## Frontend environment variables

The frontend uses the default local API URL when no environment file is present. To point it elsewhere, create `frontend/.env`:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000
```

## Useful commands

| Location | Command | Purpose |
| --- | --- | --- |
| `Backend` | `python manage.py runserver` | Start the API server |
| `Backend` | `python manage.py test` | Run Django tests |
| `frontend` | `npm run dev` | Start the development server |
| `frontend` | `npm run build` | Create a production build |
| `frontend` | `npm run lint` | Run ESLint |

## API

The backend exposes its routes from the server root. Authentication uses access and refresh tokens; after signing in, send the access token as `Authorization: Bearer <access-token>` for protected routes. See the [backend README](Backend/README.md) for the complete route list and request details.

## Notes

- `Backend/.env`, the local SQLite database, virtual environments, and Python cache files are intentionally ignored by Git.
- The default CORS configuration permits the local Vite development addresses on ports `5173`.
