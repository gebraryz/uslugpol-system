# `@uslugpol/event-service`

Moduł domenowy dla spółki obsługującej wydarzenia (eventy). Pakiet ten reprezentuje osobny bounded context i działa na własnym schemacie bazy danych: `event_service`.

## Za co odpowiada ten moduł

- odbiera leady eventowe z Core (eventy)
- trzyma własny inbox leadów eventowych
- przechowuje dane wzbogacające (np. szczegóły eventu)
- odbiera propozycje cross-sell z Core
- umożliwia raportowanie nowych okazji sprzedażowych do Core

## Struktura

```text
packages/event-service
├── prisma/              # schema.prisma + migracje (schema: event_service)
├── src/db/              # tworzenie klienta Prisma dla modułu
├── src/events/          # handlery eventów z Core
├── generated/           # wygenerowany client dla Prisma ORM
├── index.ts             # publiczne API paczki
└── .env                 # ENV dla Prisma ORM (migracje)
```

## ENV (do migracji Prisma)

Utwórz `packages/event-service/.env`:

```env
DATABASE_URL_EVENT=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=event_service
```

Można też skopiować z `packages/event-service/.env.example`.

## Najważniejsze eksporty

- `createEventDb(...)` - połączenie bazy danych z modułem eventowym
- `registerEventServiceHandlers(...)` - handlery eventów z Core
- enumy / typy Prisma modułu eventowego

## Komendy (z roota repo)

```bash
pnpm --filter @uslugpol/event-service db:generate
pnpm --filter @uslugpol/event-service db:migrate
pnpm --filter @uslugpol/event-service db:migrate:deploy
pnpm --filter @uslugpol/event-service db:studio
pnpm --filter @uslugpol/event-service lint
pnpm --filter @uslugpol/event-service check-types
```
