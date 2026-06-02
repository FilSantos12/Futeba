import { useState } from 'react';
import { Jogador, Time, NIVEL_LABELS } from '../types';
import { sortearTimes } from '../utils/sortear';
import { NivelBadge } from './NivelBadge';

interface Props {
  jogadores: Jogador[];
}

export function SorteioTimes({ jogadores }: Props) {
  const [porTime, setPorTime] = useState(6);
  const [resultado, setResultado] = useState<{ times: Time[]; reservas: Jogador[]; avisos: string[] } | null>(null);
  const [animKey, setAnimKey] = useState(0);

  const presentes = jogadores.filter((j) => !j.faltou);
  const minimo = porTime * 2;
  const podeJogar = presentes.length >= minimo;

  const handleSortear = () => {
    setResultado(sortearTimes(presentes, porTime));
    setAnimKey((k) => k + 1);
  };

  const handleExportarTimes = () => {
    if (!resultado) return;
    const linhas = resultado.times.map((t) => {
      const jogadoresStr = t.jogadores
        .map((j) => `  - ${j.nome} (${j.nivel} - ${NIVEL_LABELS[j.nivel]})`)
        .join('\n');
      return `${t.nome} [${t.cor.nome}] (Força: ${t.forca})\n${jogadoresStr}`;
    });
    if (resultado.reservas.length > 0) {
      linhas.push(`\nReservas:\n${resultado.reservas.map((j) => `  - ${j.nome}`).join('\n')}`);
    }
    const texto = `FUTEBA — Sorteio de times\n${new Date().toLocaleString('pt-BR')}\n\n${linhas.join('\n\n')}`;
    const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `futeba_times_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const maxForca = resultado
    ? Math.max(...resultado.times.map((t) => t.forca), 1)
    : 1;

  return (
    <div>
      {/* Config */}
      <div style={cardStyle}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle}>Presentes</label>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, fontFamily: '"Bebas Neue", sans-serif', color: 'var(--accent)', letterSpacing: '0.05em' }}>
              {presentes.length}
            </span>
            {jogadores.length !== presentes.length && (
              <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                de {jogadores.length}
              </span>
            )}
          </div>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label style={labelStyle}>Jogadores por time</label>
          <select
            value={porTime}
            onChange={(e) => setPorTime(Number(e.target.value))}
            style={selectStyle}
          >
            {[4, 5, 6, 7, 8, 9, 10, 11].map((n) => (
              <option key={n} value={n}>{n} jogadores</option>
            ))}
          </select>
        </div>

        {!podeJogar && (
          <div style={warnStyle}>
            ⚠️ Cadastre pelo menos <strong>{minimo} jogadores presentes</strong> para sortear times de {porTime}.
            Faltam {minimo - presentes.length}.
          </div>
        )}

        <button
          onClick={handleSortear}
          disabled={!podeJogar}
          style={{
            ...btnBigStyle,
            opacity: podeJogar ? 1 : 0.5,
            cursor: podeJogar ? 'pointer' : 'not-allowed',
          }}
        >
          ⚽ Sortear times
        </button>

        {resultado && (
          <button
            onClick={handleExportarTimes}
            style={{ ...btnOutlineStyle, width: '100%', justifyContent: 'center', marginTop: '10px' }}
          >
            ↓ Exportar resultado
          </button>
        )}
      </div>

      {/* Resultado */}
      {resultado && (
        <div key={animKey}>
          {resultado.avisos.length > 0 && (
            <div style={{ marginBottom: '1rem' }}>
              {resultado.avisos.map((aviso, i) => (
                <div key={i} style={warnStyle}>⚠️ {aviso}</div>
              ))}
            </div>
          )}

          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            {resultado.times.length} times formados
            {resultado.reservas.length > 0 && ` • ${resultado.reservas.length} reserva(s)`}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px', marginBottom: '1rem' }}>
            {resultado.times.map((time) => {
              const cor = time.cor;
              return (
                <div
                  key={time.id}
                  style={{ border: `2px solid ${cor.border}`, borderRadius: '12px', overflow: 'hidden', background: 'var(--card-bg)' }}
                >
                  {/* Header */}
                  <div style={{ background: cor.primary, padding: '12px 16px' }}>
                    <div style={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '22px', color: cor.text, letterSpacing: '0.05em', lineHeight: 1.1 }}>
                      {time.nome}
                    </div>
                    <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '10px', fontWeight: 600, background: cor.badge, color: cor.primary, borderRadius: '99px', padding: '2px 8px', letterSpacing: '0.03em' }}>
                      {cor.nome}
                    </span>
                  </div>

                  {/* Jogadores */}
                  <div style={{ padding: '4px 16px 0' }}>
                    {time.jogadores.map((j, i) => (
                      <div
                        key={j.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '8px',
                          padding: '8px 0',
                          borderBottom: i < time.jogadores.length - 1 ? '1px solid var(--border)' : 'none',
                        }}
                      >
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text)', flex: 1 }}>{j.nome}</span>
                        <NivelBadge nivel={j.nivel} />
                      </div>
                    ))}
                  </div>

                  {/* Barra de força */}
                  <div style={{ padding: '10px 16px 12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Força: {time.forca}</span>
                    </div>
                    <div style={{ position: 'relative', height: '4px', borderRadius: '2px' }}>
                      <div style={{ position: 'absolute', inset: 0, background: cor.primary, borderRadius: '2px', opacity: 0.25 }} />
                      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, background: cor.primary, borderRadius: '2px', width: `${(time.forca / maxForca) * 100}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {resultado.reservas.length > 0 && (
            <div style={cardStyle}>
              <p style={{ ...labelStyle, marginBottom: '10px' }}>Reservas</p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {resultado.reservas.map((j) => (
                  <div
                    key={j.id}
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '99px' }}
                  >
                    <span style={{ fontSize: '13px' }}>{j.nome}</span>
                    <NivelBadge nivel={j.nivel} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const cardStyle: React.CSSProperties = {
  background: 'var(--card-bg)',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  padding: '1.25rem',
  marginBottom: '1.25rem',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--text-secondary)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  marginBottom: '4px',
};

const selectStyle: React.CSSProperties = {
  padding: '12px',
  fontSize: '16px',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  background: 'var(--input-bg)',
  color: 'var(--text)',
  outline: 'none',
  width: '100%',
};

const warnStyle: React.CSSProperties = {
  background: '#FAEEDA',
  color: '#854F0B',
  borderRadius: '8px',
  padding: '10px 14px',
  fontSize: '13px',
  marginBottom: '1rem',
};

const btnBigStyle: React.CSSProperties = {
  width: '100%',
  height: '56px',
  fontSize: '18px',
  fontWeight: 700,
  background: 'var(--accent)',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontFamily: '"Bebas Neue", sans-serif',
  letterSpacing: '0.1em',
};

const btnOutlineStyle: React.CSSProperties = {
  padding: '10px 16px',
  fontSize: '13px',
  fontWeight: 500,
  background: 'transparent',
  color: 'var(--text-secondary)',
  border: '1px solid var(--border)',
  borderRadius: '8px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '4px',
};
