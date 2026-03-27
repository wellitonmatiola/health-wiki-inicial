import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-fade-up">
        <div className="w-16 h-16 rounded-full bg-parchment-200 flex items-center justify-center mx-auto mb-6">
          <Leaf size={28} className="text-forest-600" />
        </div>
        <h1 className="font-serif text-4xl font-bold mb-3">Doença não encontrada</h1>
        <p className="text-[var(--muted)] mb-8 max-w-sm mx-auto">
          Este registro não existe ou ainda não foi publicado.
        </p>
        <Link href="/" className="btn-primary">
          Voltar à busca
        </Link>
      </div>
    </main>
  );
}
