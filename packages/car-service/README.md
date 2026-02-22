# `@uslugpol/car-service`

Moduł domenowy dla spółki wynajmu aut. To osobny bounded context z własnym schematem bazy danych: `car_service`.

## Za co odpowiada ten moduł

- odbiera leady samochodowe z Core
- trzyma własny inbox leadów
- odbiera rekomendacje cross-sell kierowane do wynajmu aut
- zapisuje decyzje dotyczące rekomendacji (np. akceptacja / odrzucenie)

## Struktura (skrót)

```text
packages/car-service
├── prisma/              # schema.prisma + migracje (schema: car_service)
├── src/                 # baza danych + handlery eventów modułu
├── generated/           # wygenerowany client Prisma
├── index.ts             # publiczne API paczki
└── .env                 # ENV dla Prisma (migracje)
```

## ENV

Utwórz `packages/car-service/.env`:

```env
DATABASE_URL_CAR=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=car_service
```

Możesz też skopiować z `packages/car-service/.env.example`.

## Najważniejsze eksporty

- `createCarDb(...)` - połączenie bazy danych z modułem Car
- `registerCarServiceHandlers(...)` - handlery eventów z Core
- enumy / typy Prisma modułu Car

## Komendy (z roota repo)

```bash
pnpm --filter @uslugpol/car-service db:generate
pnpm --filter @uslugpol/car-service db:migrate
pnpm --filter @uslugpol/car-service db:migrate:deploy
pnpm --filter @uslugpol/car-service db:studio
pnpm --filter @uslugpol/car-service lint
pnpm --filter @uslugpol/car-service check-types
```
