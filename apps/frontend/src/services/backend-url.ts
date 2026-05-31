const FALLBACK_BACKEND_URL = 'http://127.0.0.1:3001';

export function getBackendBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL ?? FALLBACK_BACKEND_URL).replace(/\/$/, '');
}
