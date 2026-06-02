import { Tab } from '../types';

interface Props {
  tab: Tab;
  setTab: (t: Tab) => void;
  jogadoresCount: number;
}

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'cadastro', icon: '➕', label: 'Cadastro' },
  { id: 'jogadores', icon: '👥', label: 'Jogadores' },
  { id: 'sortear', icon: '⚽', label: 'Sortear' },
];

export function BottomNav({ tab, setTab, jogadoresCount }: Props) {
  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        background: 'var(--header-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderTop: '1px solid var(--border)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {TABS.map(({ id, icon, label }) => {
        const active = tab === id;
        const displayLabel =
          id === 'jogadores' && jogadoresCount > 0 ? `${label} (${jogadoresCount})` : label;
        return (
          <button
            key={id}
            onClick={() => setTab(id)}
            aria-label={displayLabel}
            aria-current={active ? 'page' : undefined}
            style={{
              flex: 1,
              height: '64px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: active ? 'var(--accent)' : 'var(--text-secondary)',
              transition: 'color 0.15s',
              padding: 0,
            }}
          >
            <span style={{ fontSize: '28px', lineHeight: 1 }}>{icon}</span>
            <span style={{ fontSize: '10px', fontWeight: active ? 600 : 400, letterSpacing: '0.02em' }}>
              {displayLabel}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
