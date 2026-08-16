# TaskFlow — Task Management System

TaskFlow is a full-stack team task-management application. Users can register, create teams, add members, assign tasks, and follow work through a four-stage board: **To Do**, **Progress**, **Review**, and **Completed**.

## Features

- JWT-based registration, sign-in, token refresh, and protected client routes
- Team workspaces with a creator who is automatically an admin
- Role-aware team administration for admins and team creators
- Member lookup, member addition, and member removal
- Task creation, editing, deletion, assignment, due dates, priorities, and statuses
- Per-team task totals, status counts, high-priority count, and overdue count
- Responsive React interface styled with Tailwind CSS

## Technology

| Area | Tools |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios, Lucide React |
| Backend | Django 5, Django REST Framework, Simple JWT, django-cors-headers |
| Development database | SQLite |

## Repository layout

```text
TaskManagementsystem/
├── Backend/   # Django REST API, models, migrations, and API documentation
├── Frontend/  # React/Vite application
└── README.md
```

## Run the application locally

### 1. Start the API

```powershell
cd Backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create `Backend/.env`:

```env
SECRET_KEY=replace-with-a-long-random-secret
DEBUG=True
```

Create the database tables and start Django:

```powershell
python manage.py migrate
python manage.py runserver
```

The API is available at `http://127.0.0.1:8000/`.

### 2. Start the web client

Open a second terminal from the repository root:

```powershell
cd Frontend
npm install
```

Create `Frontend/.env`:

```env
VITE_URL=http://127.0.0.1:8000/
```

Then run:

```powershell
npm run dev
```

Open the URL Vite reports, normally `http://localhost:5173`.

## Configuration notes

- `Backend/.env` and `Frontend/.env` are local configuration files and are ignored by Git.
- The frontend reads its API base URL from `VITE_URL`; it must match the running backend URL.
- The backend currently allows the standard Vite development origin (`http://localhost:5173`) through CORS. Add your deployment origin to `Backend/Backend/settings.py` before deploying.
- The production backend should use `DEBUG=False`, a strong `SECRET_KEY`, suitable `ALLOWED_HOSTS`, HTTPS, and a production database.

## Common commands

| Directory | Command | Purpose |
| --- | --- | --- |
| `Backend` | `python manage.py runserver` | Run the development API. |
| `Backend` | `python manage.py test` | Run Django tests. |
| `Backend` | `python manage.py createsuperuser` | Create an admin-site account. |
| `Frontend` | `npm run dev` | Run the Vite development server. |
| `Frontend` | `npm run build` | Create a production web build. |
| `Frontend` | `npm run lint` | Run frontend linting. |

## API

The API provides authentication, team, membership, task, statistics, and current-user endpoints. See the [backend API README](Backend/README.md) for the complete list of routes, authentication details, and request payloads.

## Further documentation

- [Frontend README](Frontend/README.md) — client setup, routes, and authentication behavior
- [Backend README](Backend/README.md) — API setup and endpoint reference
