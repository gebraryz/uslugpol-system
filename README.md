# UsługPOL

MVP system do zarządzania leadami i sprzedażą krzyżową dla holdingu usługowego.

## O projekcie

UsługPOL składa się z kilku spółek (obsługa eventów, wynajem aut, usługi ogólne), które do tej pory działały całkowicie niezależnie. Użytkownik systemu pracuje w ramach jednej marki, ale informacje o leadach nie przepływały między spółkami - każda prowadziła własne leady i nie miała wglądu w działania pozostałych spółek.

**System rozwiązuje ten problem:** centralizuje obsługę leadów i automatycznie wykrywa okazje do sprzedaży krzyżowej między spółkami. Klasyczny przykład: użytkownik rejestruje lead dotyczący eventu poza miastem -> system rekomenduje ofertę wynajmu auta od siostrzanej spółki.

## Technologie

- **Front-end**: Next.js 16, React 19, Tailwind CSS 4, shadcn/ui
- **Back-end**: Next.js Server Actions wraz z API Routes
- **Baza danych**: PostgreSQL + Prisma ORM 7
- **Testy**: Vitest 4
- **Monorepo**: Turborepo 2
- **Język**: TypeScript 5

Projekt jest zbudowany jako **modular monolith** - jedna aplikacja podzielona na wyraźnie odseparowane moduły domenowe (`core`, `event`, `car`). Każdy moduł ma własny schemat bazy danych w `schema.prisma`.

## Struktura projektu

```
.
├── apps/
│   └── web/               # Aplikacja Next.js (UI + API)
└── packages/
    ├── core/              # Główna logika: leady, cross-sell, audyt
    ├── event-service/     # Moduł spółki eventowej
    ├── car-service/       # Moduł spółki wynajmu aut
    ├── shared/            # Wspólne typy i helpery
    └── config/            # Pliki konfiguracyjne ESLinta i TypeScripta
```

Separacja modułów jest celowa - odzwierciedla granice domenowe między spółkami holdingu, jednocześnie umożliwiając im komunikację przez wspólne eventy.

## Zakres MVP

W obecnym MVP zaimplementowane są moduły domenowe `event-service` i `car-service` oraz centralny moduł `core`.

Moduł `cleaning-service` nie jest częścią bieżącego zakresu implementacyjnego - został świadomie odłożony na wdrożenie go w przyszłości. W aplikacji `apps/web` przygotowano natomiast miejsce w UI, które zostało "zarezerwowane" pod przyszłą implementację tego modułu.

## Jak uruchomić projekt

### Wymagania

- Node.js >= 18
- pnpm 9 (`npm install -g pnpm`)
- Docker + Docker Compose

### Co zrobić krok po kroku

**1. Zainstaluj zależności**

```bash
pnpm install
```

**2. Uruchom bazę danych**

```bash
docker compose up -d
```

Docker automatycznie tworzy bazę danych `uslugpol` z trzema schemami (`core`, `event_service`, `car_service`).

**3. Skonfiguruj zmienne środowiskowe**

Utwórz plik `apps/web/.env` z poniższymi wartościami:

```env
DATABASE_URL_CORE=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=core
DATABASE_URL_EVENT=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=event_service
DATABASE_URL_CAR=postgresql://uslugpol:uslugpol@localhost:5432/uslugpol?schema=car_service
```

Oraz osobne pliki `.env` w każdym pakiecie (wymagane do migracji):

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

Każdy pakiet Prisma ładuje swój `.env` lokalnie - samo `apps/web/.env` nie wystarczy do uruchomienia migracji.

**4. Wygeneruj klientów Prisma i wykonaj migracje**

```bash
pnpm db:generate
pnpm db:migrate:deploy
```

**5. Uruchom aplikację**

```bash
pnpm dev
```

Aplikacja będzie dostępna pod [http://localhost:3000](http://localhost:3000)

---

## Dodatkowe komendy

```bash
pnpm exec vitest run   # testy
pnpm lint              # linting
pnpm check-types       # sprawdzenie typów TypeScript
```
