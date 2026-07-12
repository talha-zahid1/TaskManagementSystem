# Task Management System API

Django REST API for the Task Management System. It provides user registration and JWT authentication, plus endpoints for teams, memberships, tasks, and task statistics.

## Requirements

- Python 3.10 or newer
- pip

## Setup

From this directory, create and activate a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

Create a `.env` file beside `manage.py`:

```env
SECRET_KEY=replace-with-a-long-random-secret
DEBUG=True
```

Apply database migrations and start the server:

```powershell
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

The development server runs at `http://127.0.0.1:8000`.

## Authentication

Register an account with `POST /register/`, then obtain tokens with `POST /api/token/`.

```json
{
  "username": "jane",
  "password": "your-password"
}
```

For protected endpoints, include the access token:

```http
Authorization: Bearer <access-token>
```

Refresh an expired access token with `POST /api/token/refresh/` and a JSON body containing `refresh`.

## API routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/register/` | Create a user and return JWT tokens. |
| POST | `/api/token/` | Obtain access and refresh tokens. |
| POST | `/api/token/refresh/` | Refresh an access token. |
| GET, POST | `/tasks/` | List all tasks or create a task. |
| GET, PUT, DELETE | `/tasks/<task_id>/` | Retrieve, update, or delete a task. |
| POST | `/create-team/` | Create a team; the creator becomes an admin member. |
| DELETE | `/teams/<team_id>/` | Delete a team. |
| POST | `/add-team-mem/<team_id>/` | Add a member to a team. |
| POST | `/rem-team-mem/<team_id>/` | Remove a member from a team. |
| GET | `/get-team-mem/<team_id>/` | List a team's members. |
| GET | `/get-teams/` | List teams associated with the current user. |
| GET | `/statistics/` | Return statistics across all tasks. |
| GET | `/statistics/<team_id>/` | Return statistics for one team. |
| GET | `/search-user/?q=<username>` | Look up a user by exact username. |
| GET | `/me/` | Return the authenticated user's details. |

Unless noted by the implementation, application routes require JWT authentication. Creating, updating, or deleting teams and tasks is restricted to the team creator or a member whose role is `admin`.

## Main data shapes

Create a team:

```json
{
  "team_name": "Product Team",
  "team_description": "Plans and ships product work"
}
```

Create a task:

```json
{
  "title": "Prepare release notes",
  "description": "Summarize completed work",
  "team_id": 1,
  "assigned_to": 2,
  "status": "todo",
  "priority": "High",
  "Due_date": "2026-07-20T12:00:00Z"
}
```

Add a team member:

```json
{
  "team_id": 1,
  "user_id": 2,
  "role": "member"
}
```

## Configuration

The project reads `SECRET_KEY` and `DEBUG` from `.env` using `python-decouple`. Local CORS access is configured for:

- `http://localhost:5173`
- `http://127.0.0.1:5173`

For deployment, use a secure secret key, set `DEBUG=False`, configure `ALLOWED_HOSTS`, and replace the development SQLite configuration as appropriate.

## Development commands

```powershell
python manage.py test
python manage.py createsuperuser
python manage.py runserver
```

The Django administration site is available at `/admin/` after you create a superuser.
