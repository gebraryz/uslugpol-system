# `apps/web`

Główna aplikacja Next.js dla projektu UsługPOL.

To tutaj znajduje się:

- interfejs użytkownika (widoki dla `core`, `event`, `car`, `cleaning`),
- Server Actions i API Routes,
- spięcie modułów domenowych z `packages/*`,
- lokalny event bus (in-memory) używany do komunikacji między modułami w MVP.

## Co można tu zrobić

- zarządzać leadami w module Core,
- przeglądać leady i wzbogacać dane w module Event,
- przeglądać leady / rekomendacje cross-sell w module Car,
- przełączać kontekst dostępu (widok per spółka),
- testować przepływ modular monolith + event-driven w jednej aplikacji.

## Zakres MVP (moduł `cleaning`)

W widokach aplikacji dostępny jest kontekst `cleaning`, ale w obecnym MVP pełny moduł domenowy `cleaning-service` nie jest implementowany. W UI przygotowano miejsce pod wdrożenie tego modułu w przyszłości.

## Struktura

```text
apps/web
├── src/app/         # routing Next.js (App Router) i API routes
├── src/features/    # logika per moduł: core, event, car, access, shared
├── src/components/  # komponenty UI, layout, tabele, formularze
├── src/lib/         # env, db, event bus, helpery serwerowe
├── src/constants/   # stałe aplikacyjne
├── src/hooks/       # hooki React
├── src/types/       # typy pomocnicze
└── public/
```

## ENV

Utwórz plik `apps/web/.env`:

```env
DATABASE_URL_CORE=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=core
DATABASE_URL_EVENT=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=event_service
DATABASE_URL_CAR=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=car_service
```

Aplikacja łączy się z trzema kontekstami danych (Core / Event / Car) przez osobne klienty Prisma.

## Jak uruchomić `apps/web`

Najprościej uruchamiać z katalogu głównego repo (wtedy Turbo odpali wszystko poprawnie):

```bash
pnpm dev
```

Aplikacja będzie dostępna pod `http://localhost:3000`.

## Ważna uwaga

Samo `apps/web/.env` wystarcza do uruchomienia aplikacji, ale **nie wystarcza do migracji Prisma**.
Migracje dla modułów domenowych korzystają z osobnych plików `.env` w `packages/core`, `packages/event-service`, `packages/car-service`.

## Przydatne komendy (z roota repo)

```bash
pnpm --filter web dev
pnpm --filter web lint
pnpm --filter web check-types
```
