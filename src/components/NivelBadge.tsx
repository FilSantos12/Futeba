import { Nivel, NIVEL_LABELS, NIVEL_ICONE, NIVEL_CORES } from '../types';

interface Props {
  nivel: Nivel;
}

export function NivelBadge({ nivel }: Props) {
  const { bg, text, border } = NIVEL_CORES[nivel];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        fontSize: '11px',
        fontWeight: 600,
        padding: '2px 8px',
        borderRadius: '99px',
        background: bg,
        color: text,
        border: `1px solid ${border}`,
        whiteSpace: 'nowrap',
        letterSpacing: '0.02em',
      }}
    >
      {NIVEL_ICONE[nivel]} {NIVEL_LABELS[nivel]}
    </span>
  );
}
