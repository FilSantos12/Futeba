import { Nivel, NIVEL_LABELS, NIVEL_CORES } from '../types';

interface Props {
  valor: Nivel;
  onChange?: (n: Nivel) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
  layout?: 'row' | 'grid';
}

const NIVEIS: Nivel[] = ['D', 'C', 'B', 'A'];

export function NivelStars({ valor, onChange, readonly = false, size = 'md', layout = 'row' }: Props) {
  if (readonly) {
    const { bg, text, border } = NIVEL_CORES[valor];
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          fontSize: size === 'sm' ? '11px' : '13px',
          fontWeight: 700,
          padding: size === 'sm' ? '2px 8px' : '3px 10px',
          borderRadius: '99px',
          background: bg,
          color: text,
          border: `1px solid ${border}`,
          whiteSpace: 'nowrap',
          letterSpacing: '0.02em',
        }}
      >
        {valor}
      </span>
    );
  }

  if (layout === 'grid') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
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
                minHeight: '52px',
                borderRadius: '10px',
                border: `2px solid ${selected ? border : 'var(--border)'}`,
                background: selected ? bg : 'transparent',
                color: selected ? text : 'var(--text-secondary)',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.1s',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '3px',
              }}
            >
              <span style={{ fontSize: '18px', lineHeight: 1 }}>{n}</span>
              <span style={{ fontSize: '12px', fontWeight: 500 }}>{NIVEL_LABELS[n]}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
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
              width: size === 'sm' ? '28px' : '38px',
              height: size === 'sm' ? '28px' : '38px',
              borderRadius: '7px',
              border: `2px solid ${selected ? border : 'var(--border)'}`,
              background: selected ? bg : 'transparent',
              color: selected ? text : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: size === 'sm' ? '12px' : '15px',
              cursor: 'pointer',
              transition: 'all 0.1s',
              lineHeight: 1,
            }}
          >
            {n}
          </button>
        );
      })}
    </div>
  );
}
