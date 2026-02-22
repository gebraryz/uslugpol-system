# `@uslugpol/config`

Wspólna konfiguracja dla całego monorepo. Ta paczka trzyma pliki konfiguracyjne (w tym przypadku dla ESlinta i TypeScripta), które można współdzielić między `apps/web` i paczkami z `packages/*`, żeby nie powielać konfiguracji w wielu miejscach.

## Co znajduje się w paczce

- `eslint/` - konfiguracje ESLinta
- `typescript/` - konfiguracje TypeScript (`base`, `nextjs`, `react-library`)

## Po co ten pakiet istnieje

- jedno miejsce do utrzymania reguł lintowania
- spójna konfiguracja TypeScripta między modułami
- mniej duplikacji w monorepo

## Struktura

```text
packages/config
├── eslint/              # konfiguracje ESLint
├── typescript/          # konfiguracje TS
└── package.json
```

## Jak używać

Aby skorzystać z wybranej konfiguracji z tej paczki, należy zainstalować tę paczkę w danym module, a następnie ją zaimportować.
