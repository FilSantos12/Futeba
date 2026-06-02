import { useEffect, useState } from 'react';
import { Jogador } from '../types';

interface ShuffleAnimationProps {
  jogadores: Jogador[];
}

export function ShuffleAnimation({ jogadores }: ShuffleAnimationProps) {
  const [ordem, setOrdem] = useState<Jogador[]>([...jogadores]);

  useEffect(() => {
    const interval = setInterval(() => {
      setOrdem(prev => {
        const arr = [...prev];
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: '16px 0',
    }}>
      <p style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: '26px',
        color: 'var(--accent)',
        margin: 0,
        animation: 'futebaFadeInOut 0.6s ease infinite alternate',
      }}>
        Sorteando...
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '6px',
        width: '100%',
      }}>
        {ordem.map((j) => (
          <div
            key={j.id}
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border)',
              borderRadius: '6px',
              padding: '6px 8px',
              fontSize: '11px',
              textAlign: 'center',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              color: 'var(--text)',
              animation: 'futebaCardShuffle 0.2s ease',
            }}
          >
            {j.nome}
          </div>
        ))}
      </div>
    </div>
  );
}
