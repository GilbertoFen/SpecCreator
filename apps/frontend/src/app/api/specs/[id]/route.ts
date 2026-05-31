import { NextResponse } from 'next/server';

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

export async function DELETE(
  _: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const backendUrl = resolveBackendUrl();
    const response = await fetch(`${backendUrl}/api/specs/${id}`, {
      method: 'DELETE',
      cache: 'no-store',
    });
    const payload = await parseBackendResponse(response);

    if (!response.ok) {
      return NextResponse.json(
        payload ?? {
          message: 'No fue posible eliminar la especificacion.',
        },
        { status: response.status },
      );
    }

    if (payload === null) {
      return new NextResponse(null, { status: response.status });
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
