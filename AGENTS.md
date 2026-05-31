# AGENTS.md

## Proyecto

- Nombre: `Spec Creator`
- Objetivo: generar especificaciones tecnicas estructuradas desde una descripcion libre usando Gemini.
- Stack principal:
  - Backend: NestJS con arquitectura MVC por feature module.
  - Frontend: Next.js App Router.
  - Integracion AI: `@google/genai`.

## Estructura esperada

- `apps/backend`: API NestJS.
- `apps/frontend`: UI Next.js.

## Sub-agentes

- `frontend-agent`
  - Ownership: `apps/frontend`
  - Responsabilidad: interfaz, App Router, estilos, UX, rutas internas del frontend y consumo de la API desde Next.js.
  - Limite: no modificar `apps/backend` salvo que se autorice expresamente.
- `backend-agent`
  - Ownership: `apps/backend`
  - Responsabilidad: controladores, servicios, DTOs, configuracion, integracion con Gemini y manejo de errores en NestJS.
  - Limite: no modificar `apps/frontend` salvo que se autorice expresamente.

## Features Implementados

1. Endpoint de peticion al modelo de Gemini para obtener especificaciones y frontend inicial para capturar `description` y mostrar resultado.
2. Mejora en renderizacion de respuesta con componentes modulares, iconografia, estados de carga y acciones de copiado/exportacion.
3. Login con backend y copia de la respuesta en distintos formatos para trabajar la especificacion generada.

## Feature En Progreso

- Historial de especificaciones persistidas en base de datos y visualizacion desde frontend mediante modal dedicado.

## Convenciones

- Mantener la separacion MVC en backend:
  - `controllers/`
  - `services/`
  - `dto/`
  - `interfaces/`
- Validar toda entrada HTTP con `class-validator`.
- Centralizar manejo de errores del backend y del SDK.
- En frontend, mantener UI simple y orientada a una sola tarea.
- Preferir TypeScript estricto y nombres explicitos.

## Contexto util para agentes

- Buscar primero en:
  - `apps/backend/src`
  - `apps/frontend/src`
  - `README.md`
- Ignorar siempre:
  - `node_modules`
  - `.next`
  - `dist`
  - `coverage`

## Variables de entorno relevantes

- Backend:
  - `PORT`
  - `FRONTEND_ORIGIN`
  - `GEMINI_API_KEY`
  - `GEMINI_MODEL`
- Frontend:
  - `NEXT_PUBLIC_API_URL`

## Criterios de calidad

- Respuesta del backend debe ser JSON consistente con las 6 secciones:
  - `vision`
  - `usuarios`
  - `funcionalidades`
  - `flujos`
  - `arquitectura`
  - `requisitos`
- Los errores deben regresar mensajes claros para cliente y logs utiles para servidor.
- El frontend debe mostrar el resultado de forma legible sin exponer stack traces.
