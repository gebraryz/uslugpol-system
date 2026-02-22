# `@uslugpol/shared`

Wspólny pakiet używany przez moduły domenowe i `apps/web`. Nie zawiera logiki biznesowej konkretnej spółki, a rzeczy, które muszą być współdzielone, żeby moduły mogły ze sobą razem działać.

## Co znajduje się w paczce

- `event-bus/` - typy eventów, kontrakty event busa i wspólne typy payloadów
- `db/` - helper do tworzenia połączeń Prisma + PostgreSQL (`createPrismaDb`)

## Jakie problemy rozwiązuje ta paczka

- unika duplikacji typów eventów w `core`, `event-service`, `car-service`
- pilnuje wspólnego kontraktu komunikacji między modułami
- upraszcza tworzenie klientów DB w pakietach domenowych

## Struktura

```text
packages/shared
├── event-bus/           # typy eventów i interfejs EventBus
├── db/                  # helper DB (Prisma + pg)
└── package.json
```
