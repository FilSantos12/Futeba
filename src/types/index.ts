export type Nivel = 'D' | 'C' | 'B' | 'A';

export interface Jogador {
  id: string;
  nome: string;
  nivel: Nivel;
  criadoEm: number;
}

export interface Time {
  id: number;
  nome: string;
  jogadores: Jogador[];
  forca: number;
}

export type Tab = 'cadastro' | 'jogadores' | 'sortear';

export const NIVEL_ORDEM: Record<Nivel, number> = {
  D: 1,
  C: 2,
  B: 3,
  A: 4,
};

export const NIVEL_LABELS: Record<Nivel, string> = {
  D: 'Cone',
  C: 'Operário',
  B: 'Habilidoso',
  A: 'Craque',
};

export const NIVEL_CORES: Record<Nivel, { bg: string; text: string; border: string }> = {
  D: { bg: '#F1EFE8', text: '#5F5E5A', border: '#B4B2A9' },
  C: { bg: '#EAF3DE', text: '#3B6D11', border: '#97C459' },
  B: { bg: '#E6F1FB', text: '#185FA5', border: '#85B7EB' },
  A: { bg: '#FAECE7', text: '#993C1D', border: '#F0997B' },
};
