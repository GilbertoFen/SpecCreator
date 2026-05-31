import {
  BackendErrorPayload,
  GeneratedSpec,
  SpecApiResponse,
  SpecHistoryResponse,
  StoredSpecRecord,
} from '@/types/spec';

export class SpecServiceError extends Error {
  code?: string;
  details?: string;
  status?: number;

  constructor(message: string, options?: { code?: string; details?: string; status?: number }) {
    super(message);
    this.name = 'SpecServiceError';
    this.code = options?.code;
    this.details = options?.details;
    this.status = options?.status;
  }
}

function buildMarkdown(spec: GeneratedSpec) {
  return Object.entries(spec)
    .map(([sectionKey, section]) => {
      const label = sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1);
      const items = section.content.map((item) => `- ${item}`).join('\n');

      return `## ${label}\n\n### ${section.title}\n\n${items}`;
    })
    .join('\n\n');
}

export function convertSpecToMarkdown(spec: GeneratedSpec, description?: string) {
  const intro = description ? `## Descripcion\n\n${description}\n\n` : '';

  return `# Especificacion tecnica\n\n${intro}${buildMarkdown(spec)}\n`;
}

function normalizeHistoryPayload(payload: unknown): SpecHistoryResponse {
  if (payload && typeof payload === 'object') {
    const candidate = payload as {
      specs?: unknown;
    };

    if (Array.isArray(candidate.specs)) {
      return { specs: candidate.specs as StoredSpecRecord[] };
    }
  }

  throw new SpecServiceError('La respuesta del historial no tiene el formato esperado.', {
    code: 'INVALID_HISTORY_RESPONSE',
  });
}

export async function generateSpecification(description: string): Promise<SpecApiResponse> {
  const response = await fetch('/api/specs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ description }),
  });

  const rawText = await response.text();
  const data = rawText
    ? (JSON.parse(rawText) as SpecApiResponse & BackendErrorPayload)
    : null;

  if (!response.ok) {
    const status = response.status;
    const message = data?.message ?? 'No fue posible generar la especificacion.';

    throw new SpecServiceError(message, {
      code: status === 400 ? 'INVALID_DESCRIPTION' : 'REQUEST_FAILED',
      details: data?.error,
      status,
    });
  }

  if (!data?.spec) {
    throw new SpecServiceError('La respuesta del servidor no tiene el formato esperado.', {
      code: 'INVALID_RESPONSE',
    });
  }

  return data;
}

export async function fetchSpecHistory(): Promise<SpecHistoryResponse> {
  const response = await fetch('/api/specs', {
    method: 'GET',
    cache: 'no-store',
  });

  const rawText = await response.text();
  const data = rawText
    ? (JSON.parse(rawText) as SpecHistoryResponse & BackendErrorPayload & { specs?: unknown })
    : null;

  if (!response.ok) {
    throw new SpecServiceError(data?.message ?? 'No fue posible consultar el historial.', {
      code: 'HISTORY_REQUEST_FAILED',
      details: data?.error,
      status: response.status,
    });
  }

  return normalizeHistoryPayload(data);
}
