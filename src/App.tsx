import { useState } from 'react';
import { Tab } from './types';
import { useJogadores } from './hooks/useJogadores';
import { CadastroForm } from './components/CadastroForm';
import { ListaJogadores } from './components/ListaJogadores';
import { SorteioTimes } from './components/SorteioTimes';
import { BottomNav } from './components/BottomNav';
import './App.css';

export default function App() {
  const [tab, setTab] = useState<Tab>('cadastro');
  const [darkMode, setDarkMode] = useState(false);
  const { jogadores, adicionar, remover, editar, importar, exportar } = useJogadores();

  return (
    <div
      className={darkMode ? 'dark' : ''}
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh', background: 'var(--bg)', transition: 'background 0.2s' }}
    >
      <header
        style={{
          background: 'var(--header-bg)',
          borderBottom: '1px solid var(--border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          height: '52px',
          flexShrink: 0,
        }}
      >
        <div style={{ padding: '0 1rem', display: 'flex', alignItems: 'center', height: '100%', gap: '10px' }}>
          <span style={{ fontSize: '24px', lineHeight: 1 }}>⚽</span>
          <span style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '26px', letterSpacing: '0.12em', color: 'var(--accent)' }}>
            FUTEBA
          </span>
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Alternar tema"
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '18px',
              color: 'var(--text-secondary)',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
          padding: '1rem 1rem calc(64px + env(safe-area-inset-bottom) + 1rem)',
        }}
      >
        {tab === 'cadastro' && <CadastroForm onAdicionar={adicionar} />}
        {tab === 'jogadores' && (
          <ListaJogadores
            jogadores={jogadores}
            onRemover={remover}
            onEditar={editar}
            onExportar={exportar}
            onImportar={importar}
          />
        )}
        {tab === 'sortear' && <SorteioTimes jogadores={jogadores} />}
      </main>

      <BottomNav tab={tab} setTab={setTab} jogadoresCount={jogadores.length} />
    </div>
  );
}
