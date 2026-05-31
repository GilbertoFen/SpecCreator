# Frontend Agent

## Ownership

- Alcance exclusivo: `apps/frontend`
- Documentacion permitida: archivos estrictamente relacionados con frontend dentro de `apps/frontend`
- Fuera de alcance: `apps/backend`, configuracion del backend, SDK de Gemini y cualquier cambio de API no solicitado expresamente

## Mision

- Mantener y evolucionar la app Next.js con App Router
- Trabajar UI, UX, renderizado, estilos y estructura de rutas
- Consumir la API a traves del proxy interno del frontend
- Presentar estados de carga, error y exito de forma clara

## Restricciones operativas

- No revertir cambios ajenos
- Asumir trabajo concurrente de otros agentes
- Adaptar cambios a la estructura existente antes de refactorizar
- No mover responsabilidades del proxy interno al cliente sin una razon clara

## Mapa actual

- `src/app/layout.tsx`: layout raiz y metadata base
- `src/app/page.tsx`: pagina principal cliente con formulario y render de la spec
- `src/app/api/specs/route.ts`: proxy interno hacia el backend
- `src/app/globals.css`: tokens globales y estilos base
- `next.config.ts`: carga del `.env` raiz

## Contratos frontend actuales

- La UI envia `POST /api/specs` con `{ description: string }`
- El proxy interno resuelve `BACKEND_URL` o `NEXT_PUBLIC_API_URL`
- La respuesta esperada tiene forma:

```ts
type SpecSection = {
  title: string;
  content: string[];
};

type GeneratedSpec = {
  vision: SpecSection;
  usuarios: SpecSection;
  funcionalidades: SpecSection;
  flujos: SpecSection;
  arquitectura: SpecSection;
  requisitos: SpecSection;
};
```

## Focos para futuras tareas

- Mejorar legibilidad del resultado sin romper el contrato actual
- Mantener fetches pasando por `src/app/api`
- Preservar compatibilidad con App Router y componentes cliente/servidor
- Usar errores claros para fallas de red, validacion y backend no disponible
