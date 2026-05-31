import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Spec Creator',
  description: 'Genera especificaciones tecnicas estructuradas con Gemini.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
