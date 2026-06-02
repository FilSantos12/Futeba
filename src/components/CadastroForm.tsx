import { useState, useRef } from 'react';
import { Nivel, NIVEL_LABELS } from '../types';
import { NivelStars } from './NivelStars';

interface Props {
  onAdicionar: (nome: string, nivel: Nivel) => boolean;
}

export function CadastroForm({ onAdicionar }: Props) {
  const [nome, setNome] = useState('');
  const [nivel, setNivel] = useState<Nivel>('B');
  const [feedback, setFeedback] = useState<{ msg: string; ok: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    const ok = onAdicionar(nome, nivel);
    if (ok) {
      setFeedback({ msg: `✓ ${nome.trim()} adicionado!`, ok: true });
      setNome('');
      setNivel('B');
      inputRef.current?.focus();
      try { navigator.vibrate?.(50); } catch { /* não suportado */ }
    } else {
      setFeedback({
        msg: nome.trim() ? 'Jogador já cadastrado.' : 'Digite o nome do jogador.',
        ok: false,
      });
    }
    setTimeout(() => setFeedback(null), 2500);
  };

  return (
    <div
      style={{
        background: 'var(--card-bg)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '1.25rem',
      }}
    >
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Nome do jogador</label>
        <input
          ref={inputRef}
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          placeholder="Ex: Carlos Silva"
          maxLength={40}
          style={inputStyle}
          autoFocus
        />
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Nível — {NIVEL_LABELS[nivel]}</label>
        <div style={{ marginTop: '8px' }}>
          <NivelStars valor={nivel} onChange={setNivel} />
        </div>
      </div>

      <button onClick={handleSubmit} style={btnPrimaryStyle}>
        + Adicionar jogador
      </button>

      {feedback && (
        <p
          style={{
            marginTop: '12px',
            fontSize: '14px',
            color: feedback.ok ? '#3B6D11' : '#A32D2D',
            fontWeight: 500,
          }}
        >
          {feedback.msg}
        </p>
      )}
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  marginBottom: '6px',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  fontSize: '16px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  background: 'var(--input-bg)',
  color: 'var(--text)',
  outline: 'none',
  boxSizing: 'border-box',
};

const btnPrimaryStyle: React.CSSProperties = {
  width: '100%',
  height: '52px',
  fontSize: '16px',
  fontWeight: 600,
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  letterSpacing: '0.02em',
};
