import { AuthLoginResponse, BackendErrorPayload, LoginRequest } from '@/types/spec';

export class AuthServiceError extends Error {
  status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'AuthServiceError';
    this.status = status;
  }
}

export async function loginWithBackend(
  credentials: LoginRequest,
): Promise<AuthLoginResponse> {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  const rawText = await response.text();
  const data = rawText ? (JSON.parse(rawText) as AuthLoginResponse & BackendErrorPayload) : null;

  if (!response.ok) {
    throw new AuthServiceError(
      data?.message ?? 'No fue posible iniciar sesion con el backend.',
      response.status,
    );
  }

  if (!data?.user?.username) {
    throw new AuthServiceError('La respuesta del login no tiene el formato esperado.');
  }

  return data;
}
