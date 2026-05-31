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
BACKEND_URL=http://127.0.0.1:3001
DATABASE_URL=postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST_NEON/TU_DATABASE?sslmode=require
DIRECT_URL=postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST_NEON/TU_DATABASE?sslmode=require
```

Si `PORT` no esta definido, el backend intentara inferirlo desde `NEXT_PUBLIC_API_URL`.

Usa `.env.example` como plantilla. En Neon:

- `DATABASE_URL` es la cadena de conexion principal que usa Prisma Client.
- `DIRECT_URL` puede ser la misma URL en Neon para ejecutar migraciones con Prisma.

## Desarrollo

Para levantar ambos proyectos con un solo comando:

```bash
npm run dev
```

El script `scripts/dev-all.sh` inicia:

- Frontend en `http://127.0.0.1:3000`
- Backend en `http://127.0.0.1:3001` o en el valor definido por `PORT`

Si prefieres ejecutarlos por separado:

```bash
npm run dev --workspace backend
npm run dev --workspace frontend
```

## Despliegue en Vercel

El frontend de Next.js si puede desplegarse en Vercel sin cambios mayores.

El backend actual no esta listo para Vercel tal como esta implementado, por estas razones:

- NestJS arranca con `app.listen(...)`, lo que asume un servidor persistente.
- Nest no esta expuesto como funcion serverless.
- El backend requiere una base de datos externa para persistencia.

Recomendacion pragmatica:

- Desplegar `apps/frontend` en Vercel.
- Desplegar `apps/backend` en un servicio con servidor Node persistente, por ejemplo Render.
- Usar Neon Postgres con `DATABASE_URL` y `DIRECT_URL`.

Si quieres desplegar tambien el backend en Vercel, hace falta refactorizar Nest para exponerlo como funcion serverless y sustituir SQLite por una base de datos administrada.

## Despliegue separado recomendado

La configuracion incluida en este repo esta pensada para:

- `apps/frontend` en Vercel
- `apps/backend` en Render

### Backend en Render + Neon

Se agrego [render.yaml](/Users/Gil/Documents/PR/SDD/Claude/SpecCreator/render.yaml:1) para que Render detecte el servicio del backend desde este monorepo.

Pasos:

1. En Render, crea un nuevo `Web Service` conectando este repositorio.
2. Render detectara `render.yaml`. Usa esa configuracion.
3. En variables de entorno define:

```bash
FRONTEND_ORIGIN=https://tu-frontend.vercel.app
GEMINI_API_KEY=tu_api_key
GEMINI_MODEL=gemini-2.5-flash
DATABASE_URL=postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST_NEON/TU_DATABASE?sslmode=require
DIRECT_URL=postgresql://TU_USUARIO:TU_PASSWORD@TU_HOST_NEON/TU_DATABASE?sslmode=require
```

Notas:

- No definas `PORT`; Render lo inyecta automaticamente.
- El backend quedara accesible en una URL como `https://spec-creator-backend.onrender.com`.
- El script de arranque ejecuta migraciones antes de iniciar la API.
- Crea primero la base en Neon y copia su cadena de conexion.

### Frontend en Vercel

Pasos:

1. En Vercel, importa este repositorio como nuevo proyecto.
2. En `Root Directory` selecciona `apps/frontend`.
3. Verifica que el framework detectado sea `Next.js`.
4. Define estas variables de entorno:

```bash
BACKEND_URL=https://tu-backend.onrender.com
NEXT_PUBLIC_API_URL=https://tu-backend.onrender.com
```

Notas:

- `BACKEND_URL` la usan las rutas del servidor en Next.js para hablar con Render.
- `NEXT_PUBLIC_API_URL` queda alineada para cualquier uso futuro desde cliente o servidor.
- Si cambias la URL del backend, actualiza tambien `FRONTEND_ORIGIN` en Render con la URL final de Vercel.

### Orden recomendado de despliegue

1. Crea la base en Neon y copia la cadena para `DATABASE_URL` y `DIRECT_URL`.
2. Despliega el backend en Render con esas variables.
3. Copia la URL publica de Render.
4. Despliega el frontend en Vercel usando esa URL en `BACKEND_URL` y `NEXT_PUBLIC_API_URL`.
5. Copia la URL final de Vercel.
6. Actualiza `FRONTEND_ORIGIN` en Render con esa URL de Vercel y vuelve a desplegar si hace falta.

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
