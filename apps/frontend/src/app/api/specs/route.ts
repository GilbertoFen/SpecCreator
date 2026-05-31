import { NextRequest, NextResponse } from 'next/server';

function resolveBackendUrl(): string {
  const explicitUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_API_URL;

  if (explicitUrl) {
    return explicitUrl.replace(/\/$/, '');
  }

  return 'http://127.0.0.1:3001';
}

async function parseBackendResponse(response: Response) {
  const rawText = await response.text();

  return rawText ? (JSON.parse(rawText) as unknown) : null;
}

export async function GET() {
  try {
    const backendUrl = resolveBackendUrl();
    const response = await fetch(`${backendUrl}/api/specs`, {
      method: 'GET',
      cache: 'no-store',
    });
    const payload = await parseBackendResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        payload ?? {
          message: 'No fue posible consultar el historial de especificaciones.',
        },
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

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { description?: unknown };
    const backendUrl = resolveBackendUrl();

    const response = await fetch(`${backendUrl}/api/specs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const payload = await parseBackendResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        payload ?? {
          message: 'No fue posible generar la especificacion desde el backend.',
        },
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
