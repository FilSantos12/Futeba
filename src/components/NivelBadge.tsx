import { Nivel, NIVEL_LABELS, NIVEL_CORES } from '../types';
import { IconCone, IconSleepy, IconRunner, IconStar } from './Icons';

interface Props {
  nivel: Nivel;
}

const NIVEL_ICON_MAP: Record<Nivel, JSX.Element> = {
  C: <IconCone size={13} />,
  P: <IconSleepy size={13} color={NIVEL_CORES['P'].text} />,
  B: <IconRunner size={13} color={NIVEL_CORES['B'].text} />,
  A: <IconStar size={13} color={NIVEL_CORES['A'].text} />,
};

export function NivelBadge({ nivel }: Props) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        flexShrink: 0,
        fontSize: '11px',
        fontWeight: 600,
        padding: '2px 6px',
        borderRadius: '99px',
        background: NIVEL_CORES[nivel].bg,
        color: NIVEL_CORES[nivel].text,
        border: `1px solid ${NIVEL_CORES[nivel].border}`,
        letterSpacing: '0.02em',
        maxWidth: '130px',
        overflow: 'hidden',
      }}
    >
      {NIVEL_ICON_MAP[nivel]}
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, minWidth: 0 }}>
        {NIVEL_LABELS[nivel]}
      </span>
    </span>
  );
}
