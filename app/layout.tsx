import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Health Wiki — Consulta de Doenças',
  description: 'Consulta integrativa de doenças com abordagens médica, metafísica e holística.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
