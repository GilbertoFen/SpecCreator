import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/services/backend-url';

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { password?: unknown; username?: unknown };

    const response = await fetch(`${getBackendBaseUrl()}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });

    const rawText = await response.text();
    const payload = rawText ? (JSON.parse(rawText) as unknown) : null;

    if (!response.ok) {
      return NextResponse.json(
        payload ?? { message: 'No fue posible iniciar sesion desde el backend.' },
        { status: response.status },
      );
    }

    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    const message =
      error instanceof Error
        ? `No se pudo conectar con el backend: ${error.message}`
        : 'No se pudo conectar con el backend.';

    return NextResponse.json(
      {
        message,
      },
      { status: 502 },
    );
  }
}
