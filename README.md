# Spec Creator

Aplicacion fullstack para generar especificaciones tecnicas estructuradas a partir de una descripcion usando NestJS, Next.js y Gemini.

## Requisitos

- Node.js 20.9 o superior
- `GEMINI_API_KEY`

## Instalacion

```bash
npm install
```

## Variables de entorno

Crear un unico archivo `.env` en la raiz del repositorio:

```bash
PORT=3001
FRONTEND_ORIGIN=http://localhost:3000
GEMINI_API_KEY=tu_api_key
GEMINI_MODEL=gemini-2.5-flash
NEXT_PUBLIC_API_URL=http://localhost:3001
DATABASE_URL="file:./dev.db"
```

Si `PORT` no esta definido, el backend intentara inferirlo desde `NEXT_PUBLIC_API_URL`.

## Desarrollo

En terminales separadas:

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

## Endpoints

- `POST /api/specs`
- `POST /api/auth/register`
- `POST /api/auth/login`

Body para `POST /api/specs`:

```json
{
  "description": "Tu idea o descripcion"
}
```

Body para `POST /api/auth/register` y `POST /api/auth/login`:

```json
{
  "username": "tu_usuario",
  "password": "tu_password"
}
```
