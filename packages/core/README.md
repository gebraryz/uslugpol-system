# `@uslugpol/core`

Centralny moduł domenowy systemu (Core). To tutaj znajduje się główna logika wspólna:

- leady i ich statusy,
- cross-sell opportunities,
- audyt zdarzeń,
- obsługa eventów systemowych (publikacja / reakcje w Core).

## Za co odpowiada ten moduł

- przechowuje leady w schemacie `core`
- publikuje i obsługuje eventy związane z leadami
- wykrywa okazje do cross-sellu (np. reguła odległości dla eventu)
- zapisuje pełny audyt działań

## Struktura

```text
packages/core
├── prisma/              # schema.prisma + migracje (schema: core)
├── src/db/              # tworzenie klienta Prisma dla Core
├── src/events/          # handlery eventów i logika cross-sell
├── generated/           # wygenerowany `PrismaClient`
├── index.ts             # publiczne API paczki
└── .env                 # ENV dla Prisma ORM (migracje)
```

## ENV

Utwórz `packages/core/.env`:

```env
DATABASE_URL_CORE=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=core
```

Można też skopiować z `packages/core/.env.example`.

## Najważniejsze eksporty

- `createCoreDb(...)` - tworzy połączenie bazy danych dla Core
- `registerCoreHandlers(...)` - rejestruje handlery eventów Core
- enumy / typy Prisma (np. statusy leadów, typy leadów)

## Komendy

```bash
pnpm --filter @uslugpol/core db:generate
pnpm --filter @uslugpol/core db:migrate
pnpm --filter @uslugpol/core db:migrate:deploy
pnpm --filter @uslugpol/core db:studio
pnpm --filter @uslugpol/core lint
pnpm --filter @uslugpol/core check-types
```
