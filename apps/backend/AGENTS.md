# Backend AGENTS

## Scope

- Este contexto aplica solo a `apps/backend`.
- El ownership del sub-agente de backend cubre exclusivamente la API NestJS y su documentacion tecnica local.
- No modificar `apps/frontend` desde este rol.

## Objetivo actual

- Exponer `POST /api/specs`.
- Exponer `GET /api/specs`.
- Recibir `description: string`.
- Generar una especificacion tecnica estructurada con Gemini.
- Persistir las specs validas en Supabase Postgres via Prisma.
- Responder JSON consistente y manejar errores con mensajes claros.

## Estructura actual

- `src/main.ts`
  - Bootstrap de Nest.
  - Configura CORS con `FRONTEND_ORIGIN`.
  - Registra `ValidationPipe`.
  - Registra `GlobalExceptionFilter`.
  - Resuelve puerto desde `PORT` o, en fallback, desde `NEXT_PUBLIC_API_URL`.
- `src/app.module.ts`
  - Carga configuracion global con `ConfigModule.forRoot`.
  - Lee `.env` desde la raiz del repositorio.
  - Importa `SpecModule`.
- `src/spec/spec.module.ts`
  - Feature module actual.
- `src/auth/auth.module.ts`
  - Feature module para registro y login.
- `src/prisma/prisma.module.ts`
  - Modulo global para acceso a Prisma.
- `prisma/schema.prisma`
  - Schema SQLite con modelos `User` y `Spec`.
- `src/spec/controllers/spec.controller.ts`
  - Endpoints `POST /api/specs` y `GET /api/specs`.
- `src/auth/controllers/auth.controller.ts`
  - Endpoints `POST /api/auth/register` y `POST /api/auth/login`.
- `src/spec/dto/create-spec.dto.ts`
  - Valida `description` con `class-validator`.
- `src/auth/schemas/auth.schema.ts`
  - Valida `username` y `password` con Zod.
- `src/shared/pipes/zod-validation.pipe.ts`
  - Integracion de Zod como pipe de Nest.
- `src/spec/services/gemini-spec.service.ts`
  - Inicializa `GoogleGenAI`.
  - Lee `GEMINI_API_KEY` y `GEMINI_MODEL`.
  - Construye prompt de sistema y JSON schema.
  - Traduce errores del SDK a errores HTTP claros.
- `src/spec/services/spec.service.ts`
  - Orquesta generacion, persistencia y listado de historial.
- `src/auth/services/auth.service.ts`
  - Registra usuarios, hashea passwords y valida credenciales.
- `src/prisma/prisma.service.ts`
  - Inicializa Prisma y gestiona cierre ordenado.
- `src/spec/interfaces/spec-response.interface.ts`
  - Contrato de salida de la spec.
- `src/shared/filters/global-exception.filter.ts`
  - Normaliza respuestas de error HTTP e internas.

## Variables de entorno

- `PORT`
- `HOST`
- `FRONTEND_ORIGIN`
- `GEMINI_API_KEY`
- `GEMINI_MODEL`
- `NEXT_PUBLIC_API_URL`
- `DATABASE_URL`

## Contrato de respuesta

- La respuesta exitosa actual tiene forma:
  - `spec.id`
  - `spec.description`
  - `spec.spec.vision`
  - `spec.spec.usuarios`
  - `spec.spec.funcionalidades`
  - `spec.spec.flujos`
  - `spec.spec.arquitectura`
  - `spec.spec.requisitos`
  - `spec.createdAt`
  - `spec.updatedAt`
- El historial responde como:
  - `specs: StoredSpecRecord[]`
- Cada seccion contiene:
  - `title: string`
  - `content: string[]`

## Reglas de trabajo para este sub-agente

- Mantener arquitectura MVC por feature module.
- Validar toda entrada HTTP con DTOs.
- Mantener mensajes de error claros para cliente.
- No revertir cambios ajenos ni asumir worktree limpio.
- Si aparecen nuevas features, seguir esta estructura:
  - `controllers/`
  - `services/`
  - `dto/`
  - `interfaces/`

## Comandos utiles

- `npm run dev --workspace backend`
- `npm run build --workspace backend`
- `npm run lint --workspace backend`
- `npm run prisma:generate --workspace backend`
- `npm run prisma:migrate --workspace backend -- --name <migration_name>`
