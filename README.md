<<<<<<< HEAD
# project
=======
# Backend Developer Intern Assignment

Complete REST API project with JWT authentication, role-based access control, task CRUD, PostgreSQL schema, Swagger documentation, and a simple frontend UI.

## Tech Stack

- Node.js, Express.js
- PostgreSQL with SQL migrations
- JWT authentication and bcrypt password hashing
- Zod validation, Helmet, CORS, rate limiting
- Swagger/OpenAPI docs
- Vanilla JS frontend served by the API

## Features

- User registration and login
- Password hashing with bcrypt
- JWT-protected routes
- Role-based access: `USER` and `ADMIN`
- Task CRUD APIs
- Users can manage only their own tasks
- Admin can view all tasks and list users
- API versioning at `/api/v1`
- Centralized error handling and validation
- Swagger docs and Postman collection
- Docker Compose PostgreSQL setup

## Quick Start

1. Install dependencies:

```bash
npm install
```

If PowerShell blocks `npm`, run the same commands as `npm.cmd install`, `npm.cmd run dev`, and so on.

2. Copy environment variables:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Create database tables and seed an admin:

```bash
npm run db:migrate
npm run db:seed
```

5. Start the app:

```bash
npm run dev
```

Open:

- Frontend UI: `http://localhost:5000`
- Swagger Docs: `http://localhost:5000/api-docs`
- Health Check: `http://localhost:5000/health`

Seeded admin:

- Email: `admin@example.com`
- Password: `Admin@12345`

## API Summary

Base URL: `http://localhost:5000/api/v1`

| Method | Endpoint | Access | Description |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Register user |
| POST | `/auth/login` | Public | Login user |
| GET | `/auth/me` | Authenticated | Current user profile |
| GET | `/tasks` | Authenticated | List tasks |
| POST | `/tasks` | Authenticated | Create task |
| GET | `/tasks/:id` | Authenticated | Get one task |
| PATCH | `/tasks/:id` | Authenticated | Update task |
| DELETE | `/tasks/:id` | Authenticated | Delete task |
| GET | `/users` | Admin | List users |

## Database Schema

The SQL schema defines:

- `User`: `id`, `name`, `email`, `passwordHash`, `role`, timestamps
- `Task`: `id`, `title`, `description`, `status`, `dueDate`, `ownerId`, timestamps
- Relationships: one user has many tasks
- Indexes: `Task.ownerId`, `Task.status`

Schema file: `database/schema.sql`

## Security Notes

- Passwords are hashed with bcrypt before storage.
- JWT tokens are signed with `JWT_SECRET`.
- Protected endpoints require `Authorization: Bearer <token>`.
- Admin-only endpoints use role-based middleware.
- Request bodies and query params are validated with Zod.
- Basic sanitization trims string fields.
- Helmet, CORS, JSON body limits, and rate limiting are enabled.

For production, use HTTPS, a managed secret store, refresh-token rotation, short-lived access tokens, and secure cookie storage if the frontend is hosted separately.

## Scalability Note

The project uses a modular folder structure so new modules can be added without changing existing route logic. PostgreSQL indexes are included for common task queries. For larger traffic, the API can be deployed behind a load balancer, scaled horizontally with stateless JWT auth, and connected to managed PostgreSQL with read replicas. Redis can be added for caching frequently read data, session revocation lists, and rate-limit storage. Background jobs can be moved to a queue such as BullMQ when long-running work appears. The API is already versioned under `/api/v1` so future versions can coexist safely.

## Deliverables Included

- Backend source code
- Frontend UI in `public/`
- PostgreSQL schema with Prisma
- Swagger docs at `docs/openapi.yaml`
- Postman collection at `docs/postman_collection.json`
- Docker Compose for local PostgreSQL
- README setup and scalability notes
>>>>>>> e49cbe2 (Initial commit)
