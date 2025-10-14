## Streaming-Backend

TypeScript backend for a small-scale streaming service. It includes authentication, movie info, playlists, and real-time capabilities, with modular servers (main API, file server, websocket server).


## Quick Start

1. Install prerequisites

- **Node.js**: v18+ recommended
- **MySQL**: v8+ (or compatible)
- **Redis**: v6+

2. Clone and install

```bash
git clone <your-fork-or-origin-url>
cd Streaming-Backend
npm install
```

3. Create `.env`
   Copy, then adjust values (see the full list below):

```bash
cp .env.example .env  # if you create one; otherwise create .env manually
```

Minimal working example:

```env
# Server
PORT=8000

# Database
# mysql2 URL format (user:pass may need URL-encoding)
DATABASE_URL=mysql://user:password@127.0.0.1:3306/streaming_db
DATABASE_NAME=streaming_db

# Redis
REDIS_URL=redis://127.0.0.1:6379

# Auth & Security
JwtSecretKey=replace-with-long-random-string
PasswordEncrptRounds=10

# Email (SMTP)
SMTP_HOST=localhost
SMTP_PORT=1025
SMTP_USER=
SMTP_PASS=
MAIL_FROM=no-reply@example.com
SMTP_SECURE=false
EMAIL_MAX_RETRIES=3
COMPANY_NAME=Streaming Service

# Third-party APIs
TMDB_API_KEY=
```

4. Build the TypeScript sources

```bash
npx tsc
```

5. Run the main API server

```bash
npm run server:main
```

The API will listen on `http://localhost:${PORT}` (defaults to `8000`).

## Dev Workflow (Hot Reload)

This project emits compiled JS to `build/`. The run scripts use `nodemon` to watch built files. For a smooth DX:

Terminal A – TypeScript in watch mode:

```bash
npx tsc -w
```

Terminal B – Run the server on compiled output:

```bash
npm run server:main
```

Optionally, you can start the file and websocket servers (currently scaffolds):

```bash
npm run server:file
npm run server:ws
```

## Environment Variables

The app reads configuration via `dotenv`. Below are the variables referenced in code, grouped by concern.

- **Server**

  - `PORT` (number) – Port for the main API; default: `8000`.

- **Database (MySQL via mysql2)**

  - `DATABASE_URL` (string) – Required. Full MySQL URI (e.g., `mysql://user:pass@host:3306/db`).
  - `DATABASE_NAME` (string) – Required for DB reset/migration helper logic.

- **Redis**

  - `REDIS_URL` (string) – Required. e.g., `redis://localhost:6379`.

- **Auth/Security**

  - `JwtSecretKey` (string) – Required. Secret for JWT signing.
  - `PasswordEncrptRounds` (number) – Optional; bcrypt rounds (default: 10 suggested).

- **Email (SMTP)**

  - `SMTP_HOST`, `SMTP_PORT` (number), `SMTP_USER`, `SMTP_PASS` – Required to send emails.
  - `MAIL_FROM` (string) – Required. From address.
  - `SMTP_SECURE` (boolean string: `true`/`false`) – Optional; default `false`.
  - `EMAIL_MAX_RETRIES` (number) – Optional; default `3`.
  - `COMPANY_NAME` (string) – Optional; default `PaschalGlobal Tv`.

- **Third-Party APIs**

  - `TMDB_API_KEY` (string) – Required for TMDB integration when used.



## Database Setup

Migrations are stored as SQL files in `src/database/migrations/`.

At runtime, `database.dbInit()` is invoked without resetting or applying migrations automatically. For a fresh setup,pass true for `database.dbInit()` and compile and at runtime the db will be reset

1. Create the database:

```sql
CREATE DATABASE IF NOT EXISTS streaming_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
```




## Running Tests

Unit/integration tests use Jest.

```bash
npm test
```



## Common Issues & Troubleshooting

- "dbUrl undefined" or DB connection errors

  - Ensure `DATABASE_URL` is set and valid; verify the DB is reachable.

- Redis connection errors

  - Ensure `REDIS_URL` is set and Redis is running locally or reachable remotely.

- Email send failures

  - Ensure `SMTP_*` and `MAIL_FROM` are set. For local dev, consider using a local SMTP sink (e.g., MailHog: `SMTP_HOST=localhost`, `SMTP_PORT=1025`).

- 404s under `/api/v1`
  - Verify the server started without exceptions and that you are hitting the correct base path.

## Contributing / Dev Notes

- Use Node 18+ and keep dependencies up to date.
- Run `npx tsc -w` during development for quick feedback; `nodemon` watches the compiled `build/` output.
- Add new env vars to this README when introducing new integrations.

---

Refer to `src/database/migrations/initial_tables.sql` for the exact schema.
