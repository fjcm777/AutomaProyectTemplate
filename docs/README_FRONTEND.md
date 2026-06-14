# Frontend Guide

Frontend construido con React 18 + TypeScript + Vite + React Query.

## Estructura

```text
frontend/
|-- src/
|   |-- app/
|   |   `-- router/          # Definicion de rutas
|   |-- features/
|   |   `-- products/        # Feature de ejemplo (CRUD)
|   |-- shared/
|   |   |-- api/             # Cliente HTTP centralizado
|   |   `-- types/           # Tipos compartidos
|   |-- styles/
|   |-- app.tsx
|   `-- main.tsx
|-- package.json
`-- vite.config.js
```

## Flujo recomendado por feature

Para crear `features/<feature>`:
1. Definir `types` del feature.
2. Crear funciones de `api`.
3. Crear hooks react-query en `hooks`.
4. Construir componentes y paginas.
5. Registrar rutas en `src/app/router/router.tsx`.

## Comandos utiles

```bash
npm install
npm run dev
npx tsc --noEmit
npm run build
```

## Cliente API

`src/shared/api/clients.ts` centraliza:
- URL base (`VITE_API_URL`)
- Headers por defecto
- Manejo de errores HTTP

Mantener este punto unico evita duplicar logica de fetch en features.