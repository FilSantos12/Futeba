import { useState, useEffect } from 'react';
import { Jogador, Nivel } from '../types';

const STORAGE_KEY = 'futeba_jogadores';

function migrarNivel(nivel: unknown): Nivel {
  if (nivel === 1 || nivel === 2) return 'C';
  if (nivel === 3 || nivel === 4) return 'B';
  if (nivel === 5) return 'A';
  if (nivel === 'D') return 'C';
  if (nivel === 'C' || nivel === 'B' || nivel === 'A') return nivel;
  return 'B';
}

export function useJogadores() {
  const [jogadores, setJogadores] = useState<Jogador[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      const lista: unknown[] = parsed.jogadores ?? parsed;
      if (!Array.isArray(lista)) return [];
      return lista.map((j) => ({ ...(j as Jogador), nivel: migrarNivel((j as Jogador).nivel) }));
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jogadores));
  }, [jogadores]);

  const adicionar = (nome: string, nivel: Nivel): boolean => {
    const nomeNorm = nome.trim();
    if (!nomeNorm) return false;
    const jaExiste = jogadores.some(
      (j) => j.nome.toLowerCase() === nomeNorm.toLowerCase(),
    );
    if (jaExiste) return false;
    const novo: Jogador = {
      id: crypto.randomUUID(),
      nome: nomeNorm,
      nivel,
      criadoEm: Date.now(),
    };
    setJogadores((prev) => [...prev, novo]);
    return true;
  };

  const remover = (id: string) => {
    setJogadores((prev) => prev.filter((j) => j.id !== id));
  };

  const toggleFaltou = (id: string) => {
    setJogadores((prev) =>
      prev.map((j) => (j.id === id ? { ...j, faltou: !j.faltou } : j)),
    );
  };

  const editar = (id: string, nome: string, nivel: Nivel) => {
    setJogadores((prev) =>
      prev.map((j) => (j.id === id ? { ...j, nome: nome.trim(), nivel } : j)),
    );
  };

  const importar = (data: Jogador[]) => {
    setJogadores(data.map((j) => ({ ...j, nivel: migrarNivel(j.nivel) })));
  };

  const exportar = () => {
    const blob = new Blob(
      [JSON.stringify({ versao: '2.0', jogadores, exportadoEm: new Date().toISOString() }, null, 2)],
      { type: 'application/json' },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `futeba_${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return { jogadores, adicionar, remover, editar, importar, exportar, toggleFaltou };
}
