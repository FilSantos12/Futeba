import { Nivel, NIVEL_LABELS, NIVEL_ICONE, NIVEL_CORES } from '../types';

interface Props {
  valor: Nivel;
  onChange?: (n: Nivel) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

const NIVEIS: Nivel[] = ['C', 'B', 'A'];

export function NivelStars({ valor, onChange, readonly = false, size = 'md' }: Props) {
  if (readonly) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: size === 'sm' ? '12px' : '14px' }}>
        {NIVEL_ICONE[valor]} {NIVEL_LABELS[valor]}
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {NIVEIS.map((n) => {
        const selected = n === valor;
        const { bg, text, border } = NIVEL_CORES[n];
        return (
          <button
            key={n}
            onClick={() => onChange?.(n)}
            aria-label={`Nível ${n} — ${NIVEL_LABELS[n]}`}
            aria-pressed={selected}
            style={{
              flex: 1,
              minHeight: '56px',
              borderRadius: '10px',
              border: `2px solid ${selected ? border : 'var(--border)'}`,
              background: selected ? bg : 'transparent',
              color: selected ? text : 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.1s',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              padding: '4px',
            }}
          >
            <span style={{ fontSize: '22px', lineHeight: 1 }}>{NIVEL_ICONE[n]}</span>
            <span style={{ fontSize: '11px' }}>{NIVEL_LABELS[n]}</span>
          </button>
        );
      })}
    </div>
  );
}
