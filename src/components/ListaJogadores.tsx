import { useState } from 'react';
import { Jogador, Nivel, NIVEL_LABELS, NIVEL_ORDEM } from '../types';
import { NivelBadge } from './NivelBadge';
import { NivelStars } from './NivelStars';
import {
  IconEdit, IconTrash, IconCheck, IconClose,
  IconSearch, IconExport, IconImport,
  IconAbsent, IconPresent,
} from './Icons';

interface Props {
  jogadores: Jogador[];
  onRemover: (id: string) => void;
  onEditar: (id: string, nome: string, nivel: Nivel) => void;
  onToggleFaltou: (id: string) => void;
  onExportar: () => void;
  onImportar: (data: Jogador[]) => void;
}

export function ListaJogadores({ jogadores, onRemover, onEditar, onToggleFaltou, onExportar, onImportar }: Props) {
  const [busca, setBusca] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [editNome, setEditNome] = useState('');
  const [editNivel, setEditNivel] = useState<Nivel>('B');
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

  const presentes = jogadores.filter((j) => !j.faltou);

  const sorted = [...jogadores]
    .filter((j) => j.nome.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => {
      if (!!a.faltou !== !!b.faltou) return a.faltou ? 1 : -1;
      return ordenacao === 'nivel'
        ? NIVEL_ORDEM[b.nivel] - NIVEL_ORDEM[a.nivel]
        : a.nome.localeCompare(b.nome);
    });

  return (
    <div>
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total', valor: jogadores.length },
          { label: 'Presentes', valor: presentes.length },
          { label: 'Times de 6', valor: Math.floor(presentes.length / 6) },
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
      <div style={{ position: 'relative', marginBottom: '8px' }}>
        <div style={{
          position: 'absolute',
          left: '12px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: 'var(--text-secondary)',
          pointerEvents: 'none',
          display: 'flex',
        }}>
          <IconSearch size={16} />
        </div>
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Buscar jogador..."
          style={{ ...inputStyle, width: '100%', paddingLeft: '38px' }}
        />
      </div>

      {/* Toolbar — linha 2: ordenação + exportar + importar */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <select
          value={ordenacao}
          onChange={(e) => setOrdenacao(e.target.value as 'nome' | 'nivel')}
          style={{ ...inputStyle, flex: 1 }}
        >
          <option value="nivel">Por nível</option>
          <option value="nome">Por nome</option>
        </select>
        <button onClick={onExportar} style={btnOutlineStyle} title="Exportar JSON" aria-label="Exportar">
          <IconExport size={16} />
        </button>
        <label style={{ ...btnOutlineStyle, cursor: 'pointer' }} title="Importar JSON" aria-label="Importar">
          <IconImport size={16} />
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
              /* Modo edição */
              <div key={j.id} style={{ ...itemStyle, background: 'var(--accent-light)', flexDirection: 'column', gap: '12px' }}>
                <input
                  value={editNome}
                  onChange={(e) => setEditNome(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && confirmarEdicao()}
                  style={{ ...inputStyle, width: '100%' }}
                  autoFocus
                />
                {/* Seletor de nível 2x2 + label da seleção atual */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <NivelStars valor={editNivel} onChange={setEditNivel} />
                  </div>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--text-secondary)',
                    flexShrink: 1,
                    minWidth: 0,
                    maxWidth: '100px',
                    wordBreak: 'break-word',
                    textAlign: 'right',
                    marginTop: '4px',
                  }}>
                    {NIVEL_LABELS[editNivel]}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={confirmarEdicao}
                    aria-label="Salvar edição"
                    style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center', color: '#3B6D11', borderColor: '#97C459' }}
                  >
                    <IconCheck size={18} color="#27ae60" />
                  </button>
                  <button
                    onClick={() => setEditandoId(null)}
                    aria-label="Cancelar edição"
                    style={{ ...btnOutlineStyle, flex: 1, justifyContent: 'center' }}
                  >
                    <IconClose size={18} color="#888" />
                  </button>
                </div>
              </div>
            ) : (
              /* Modo leitura */
              <div
                key={j.id}
                style={{
                  ...itemStyle,
                  opacity: j.faltou ? 0.45 : 1,
                  transition: 'opacity 0.2s',
                }}
              >
                {/* Nome — cresce e trunca com ellipsis */}
                <span
                  style={{
                    flex: '1 1 80px',
                    minWidth: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    fontWeight: 600,
                    fontSize: '13px',
                    color: 'var(--text)',
                    textDecoration: j.faltou ? 'line-through' : 'none',
                  }}
                >
                  {j.nome}
                </span>

                {/* Badge de nível — máximo 130px, texto trunca se necessário */}
                <NivelBadge nivel={j.nivel} />

                {/* Ações: Faltou/Voltou · Editar · Remover */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                  <button
                    onClick={() => onToggleFaltou(j.id)}
                    aria-label={j.faltou ? `Marcar ${j.nome} como presente` : `Marcar ${j.nome} como ausente`}
                    style={{
                      width: '32px',
                      height: '32px',
                      minWidth: '32px',
                      minHeight: '32px',
                      borderRadius: '50%',
                      border: `1px solid ${j.faltou ? '#E24B4A' : 'var(--border)'}`,
                      background: j.faltou ? '#FCEBEB' : 'transparent',
                      color: j.faltou ? '#A32D2D' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0,
                    }}
                  >
                    {j.faltou ? <IconPresent size={14} /> : <IconAbsent size={14} />}
                  </button>

                  <button
                    onClick={() => iniciarEdicao(j)}
                    style={iconBtnStyle}
                    aria-label={`Editar ${j.nome}`}
                  >
                    <IconEdit size={14} />
                  </button>
                  <button
                    onClick={() => { if (confirm(`Remover ${j.nome}?`)) onRemover(j.id); }}
                    style={{ ...iconBtnStyle, color: '#e74c3c' }}
                    aria-label={`Remover ${j.nome}`}
                  >
                    <IconTrash size={14} color="#e74c3c" />
                  </button>
                </div>
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
  gap: '6px',
  minHeight: '52px',
  padding: '10px 12px',
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '10px',
  overflow: 'hidden',
  boxSizing: 'border-box',
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
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '28px',
  height: '28px',
  minWidth: '28px',
  minHeight: '28px',
  padding: 0,
  background: 'transparent',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  color: 'var(--text-secondary)',
  transition: 'background 0.15s ease',
  flexShrink: 0,
};
