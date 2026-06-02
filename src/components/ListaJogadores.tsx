import { useState } from 'react';
import { Jogador, Nivel, NIVEL_LABELS, NIVEL_ORDEM } from '../types';
import { NivelBadge } from './NivelBadge';
import { NivelStars } from './NivelStars';

interface Props {
  jogadores: Jogador[];
  onRemover: (id: string) => void;
  onEditar: (id: string, nome: string, nivel: Nivel) => void;
  onExportar: () => void;
  onImportar: (data: Jogador[]) => void;
}

export function ListaJogadores({ jogadores, onRemover, onEditar, onExportar, onImportar }: Props) {
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editNivel, setEditNivel] = useState<Nivel>('C');
  const [ordenacao, setOrdenacao] = useState<'nome' | 'nivel'>('nivel');

  const iniciarEdicao = (j: Jogador) => {
    setEditandoId(j.id);
    setEditNome(j.nome);
    setEditNivel(j.nivel);
  };

  const confirmarEdicao = () => {
    if (editandoId && editNome.trim()) {
      onEditar(editandoId, editNome.trim(), editNivel);
      setEditandoId(null);
    }
  };

  const handleImportar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string);
        const lista: Jogador[] = data.jogadores ?? data;
        if (Array.isArray(lista)) onImportar(lista);
      } catch {
        alert('Arquivo inválido.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const sorted = [...jogadores]
    .filter((j) => j.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) =>
      ordenacao === 'nivel'
        ? NIVEL_ORDEM[b.nivel] - NIVEL_ORDEM[a.nivel]
        : a.nome.localeCompare(b.nome),
    );

  const media = jogadores.length
    ? (jogadores.reduce((s, j) => s + NIVEL_ORDEM[j.nivel], 0) / jogadores.length).toFixed(1)
    : '–';

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Jogadores', valor: jogadores.length },
          { label: 'Força média', valor: media },
          { label: 'Times de 6', valor: Math.floor(jogadores.length / 6) },
        ].map((s) => (
          <div key={s.label} style={statCardStyle}>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--accent)', fontFamily: '"Bebas Neue", sans-serif', letterSpacing: '0.05em' }}>
              {s.valor}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar — linha 1: busca */}
      <div style={{ marginBottom: '8px' }}>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar jogador..."
          style={{ ...inputStyle, width: '100%' }}
        />
      </div>

      {/* Toolbar — linha 2: ordenação + exportar + importar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as 'nome' | 'nivel')}
          style={{ ...inputStyle, flex: 1 }}
        >
          <option value="nivel">Por nível</option>
          <option value="nome">Por nome</option>
        </select>
        <button onClick={onExportar} style={btnOutlineStyle} title="Exportar JSON">
          ↓ Exportar
        </button>
        <label style={{ ...btnOutlineStyle, cursor: 'pointer' }} title="Importar JSON">
          ↑ Importar
          <input type="file" accept=".json" onChange={handleImportar} style={{ display: 'none' }} />
        </label>
      </div>

      {/* Lista */}
      {sorted.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontSize: '40px', marginBottom: '8px' }}>⚽</div>
          <p style={{ fontSize: '14px' }}>Nenhum jogador encontrado</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {sorted.map((j) =>
            editandoId === j.id ? (
              <div key={j.id} style={{ ...itemStyle, background: 'var(--accent-light)', flexDirection: 'column', gap: '12px' }}>
                <input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmarEdicao()}
                  style={{ ...inputStyle, width: '100%' }}
                  autoFocus
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <NivelStars valor={editNivel} onChange={setEditNivel} />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{NIVEL_LABELS[editNivel]}</span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={confirmarEdicao}
                    style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center', color: '#3B6D11', borderColor: '#97C459' }}
                  >
                    Salvar
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <div key={j.id} style={itemStyle}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', color: 'var(--text)' }}>{j.nome}</span>
                </div>
                <NivelBadge nivel={j.nivel} />
                <button
                  onClick={() => iniciarEdicao(j)}
                  style={iconBtnStyle}
                  aria-label={`Editar ${j.nome}`}
                >
                  ✏️
                </button>
                <button
                  onClick={() => { if (confirm(`Remover ${j.nome}?`)) onRemover(j.id); }}
                  style={{ ...iconBtnStyle, color: '#A32D2D' }}
                  aria-label={`Remover ${j.nome}`}
                >
                  🗑️
                </button>
              </div>
            ),
          )}
        </div>
      )}
    </div>
  );
}

const statCardStyle: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  padding: '10px',
  textAlign: 'center',
};

const itemStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  minHeight: '56px',
  padding: '12px 14px',
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  flexWrap: 'wrap',
};

const inputStyle: React.CSSProperties = {
  padding: '10px 12px',
  fontSize: '16px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  background: 'var(--input-bg)',
  color: 'var(--text)',
  outline: 'none',
  boxSizing: 'border-box',
};

const btnOutlineStyle: React.CSSProperties = {
  padding: '8px 14px',
  fontSize: '13px',
  fontWeight: 500,
  background: 'transparent',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  cursor: 'pointer',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
};

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '18px',
  width: '44px',
  height: '44px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '8px',
  opacity: 0.75,
  transition: 'opacity 0.1s',
  flexShrink: 0,
};
