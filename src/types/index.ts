export type Nivel = 'C' | 'B' | 'A';

export const NIVEL_ORDEM: Record<Nivel, number> = {
  C: 1,
  B: 2,
  A: 3,
};

export const NIVEL_LABELS: Record<Nivel, string> = {
  C: 'Cone',
  B: 'Corre e marca',
  A: 'Joga bem',
};

export const NIVEL_ICONE: Record<Nivel, string> = {
  C: '🔺',
  B: '🏃',
  A: '⭐',
};

export const NIVEL_CORES: Record<Nivel, { bg: string; text: string; border: string }> = {
  C: { bg: '#FAECE7', text: '#993C1D', border: '#F0997B' },
  B: { bg: '#E6F1FB', text: '#185FA5', border: '#85B7EB' },
  A: { bg: '#EAF3DE', text: '#3B6D11', border: '#97C459' },
};

export const TIME_PALETA = [
  { nome: 'Vermelho', primary: '#E24B4A', text: '#fff', border: '#E24B4A', badge: '#FCEBEB' },
  { nome: 'Azul',     primary: '#378ADD', text: '#fff', border: '#378ADD', badge: '#E6F1FB' },
  { nome: 'Verde',    primary: '#3dbb5c', text: '#fff', border: '#3dbb5c', badge: '#EAF3DE' },
  { nome: 'Amarelo',  primary: '#EF9F27', text: '#fff', border: '#EF9F27', badge: '#FAEEDA' },
  { nome: 'Roxo',     primary: '#7F77DD', text: '#fff', border: '#7F77DD', badge: '#EEEDFE' },
  { nome: 'Rosa',     primary: '#D4537E', text: '#fff', border: '#D4537E', badge: '#FBEAF0' },
] as const;

export type TimeCor = typeof TIME_PALETA[number];

export interface Jogador {
  id: string;
  nome: string;
  nivel: Nivel;
  faltou?: boolean;
  criadoEm: number;
}

export interface Time {
  id: number;
  nome: string;
  cor: TimeCor;
  jogadores: Jogador[];
  forca: number;
}

export type Tab = 'cadastro' | 'jogadores' | 'sortear';
