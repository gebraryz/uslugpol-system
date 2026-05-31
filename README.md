# UslugPOL 🚀

MVP system for managing leads and cross-sell for a service holding. ✨

## About the project

UslugPOL consists of several companies (event services, car rental, general services), which so far have operated completely independently. The system user works within one brand, but information about leads did not flow between the companies - each ran its own leads and had no insight into the activities of the other companies.

**The system solves this problem:** it centralizes lead handling and automatically detects cross-sell opportunities between companies. A classic example: a user registers a lead for an event outside the city -> the system recommends a car rental offer from a sister company. 🔁

## Technologies

- **Front-end**: Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Back-end**: Next.js Server Actions along with API Routes
- **Database**: PostgreSQL + Prisma ORM 7
- **Tests**: Vitest 4
- **Monorepo**: Turborepo 2
- **Language**: TypeScript 5

The project is built as a **modular monolith** - one application divided into clearly separated domain modules (`core`, `event`, `car`). Each module has its own database schema in `schema.prisma`.

## Project structure

```
.
├── apps/
│   └── web/               # Next.js application (UI + API)
└── packages/
    ├── core/              # Main logic: leads, cross-sell, audit
    ├── event-service/     # Event company module
    ├── car-service/       # Car rental company module
    ├── shared/            # Shared types and helpers
    └── config/            # ESLint and TypeScript config files
```

The separation of modules is intentional - it reflects domain boundaries between the companies in the holding, while allowing them to communicate through shared events.

## MVP scope

In the current MVP, the domain modules `event-service` and `car-service` and the central module `core` are implemented.

The `cleaning-service` module is not part of the current implementation scope - it was deliberately postponed for future implementation. In the `apps/web` application, a place in the UI has been prepared, which has been "reserved" for the future implementation of this module. 🧹

## How to run the project

### Requirements

- Node.js >= 18
- pnpm 9 (`npm install -g pnpm`)
- Docker + Docker Compose

### What to do step by step

**1. Install dependencies**

```bash
pnpm install
```

**2. Start the database**

```bash
docker compose up -d
```

Docker automatically creates the `uslugpol` database with three schemas (`core`, `event_service`, `car_service`).
The `docker/postgres/init/001_schemas.sql` file is used only to bootstrap these schemas before running Prisma migrations.

**3. Configure environment variables**

Create the `apps/web/.env` file with the following values:

```env
DATABASE_URL_CORE=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=core
DATABASE_URL_EVENT=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=event_service
DATABASE_URL_CAR=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=car_service
```

And separate `.env` files in each package (required for migrations):

`packages/core/.env`

```env
DATABASE_URL_CORE=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=core
```

`packages/event-service/.env`

```env
DATABASE_URL_EVENT=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=event_service
```

`packages/car-service/.env`

```env
DATABASE_URL_CAR=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=car_service
```

Each Prisma package loads its local `.env` - the `apps/web/.env` alone is not enough to run migrations.

**4. Generate Prisma clients and run migrations**

```bash
pnpm db:generate
pnpm db:migrate:deploy
```

**5. Start the application**

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Running the built application

After completing steps 1-4 (install, Docker, `.env`, migrations) you can build and run the application in production mode:

**1. Build the project**

```bash
pnpm build
```

**2. Run the built application**

```bash
pnpm start
```

The `start` script runs `apps/web` (`next start`). By default, the application will be available at [http://localhost:3000](http://localhost:3000).

---

## Additional commands

```bash
pnpm exec vitest run   # tests
pnpm lint              # linting
pnpm check-types       # TypeScript type checking
```
