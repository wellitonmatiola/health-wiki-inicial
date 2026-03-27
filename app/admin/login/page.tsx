'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Lock } from 'lucide-react';

export default function LoginPage() {
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErro('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ senha }),
    });

    if (res.ok) {
      router.push('/admin');
      router.refresh();
    } else {
      setErro('Senha incorreta. Tente novamente.');
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="card p-10 w-full max-w-sm text-center animate-fade-up">
        <div className="w-12 h-12 rounded-full bg-forest-500 flex items-center justify-center mx-auto mb-6">
          <Leaf size={22} className="text-white" />
        </div>
        <h1 className="font-serif text-2xl font-bold mb-1">Painel Admin</h1>
        <p className="text-sm text-[var(--muted)] mb-8">Health Wiki</p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="text-sm font-medium mb-1.5 block flex items-center gap-1.5">
              <Lock size={13} /> Senha de acesso
            </label>
            <input
              type="password"
              className="input"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {erro && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{erro}</p>
          )}

          <button type="submit" className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </main>
  );
}
