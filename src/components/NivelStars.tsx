import { Nivel, NIVEL_LABELS, NIVEL_CORES } from '../types';
import { IconCone, IconSleepy, IconRunner, IconStar } from './Icons';

interface Props {
  valor: Nivel;
  onChange?: (n: Nivel) => void;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

const NIVEIS: Nivel[] = ['C', 'P', 'B', 'A'];

function getNivelIcon(nivel: Nivel, size: number, color: string): JSX.Element {
  switch (nivel) {
    case 'C': return <IconCone size={size} />;
    case 'P': return <IconSleepy size={size} color={color} />;
    case 'B': return <IconRunner size={size} color={color} />;
    case 'A': return <IconStar size={size} color={color} />;
  }
}

export function NivelStars({ valor, onChange, readonly = false, size = 'md' }: Props) {
  if (readonly) {
    const iconSize = size === 'sm' ? 12 : 14;
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: size === 'sm' ? '12px' : '14px' }}>
        {getNivelIcon(valor, iconSize, NIVEL_CORES[valor].text)} {NIVEL_LABELS[valor]}
      </span>
    );
  }

  return (
    <div style={{ display: 'flex', gap: '6px' }}>
      {NIVEIS.map((n) => {
        const selected = n === valor;
        const { bg, text, border } = NIVEL_CORES[n];
        const iconColor = selected ? text : 'var(--text-secondary)';
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
            {getNivelIcon(n, 22, iconColor)}
            <span style={{ fontSize: '11px' }}>{NIVEL_LABELS[n]}</span>
          </button>
        );
      })}
    </div>
  );
}
