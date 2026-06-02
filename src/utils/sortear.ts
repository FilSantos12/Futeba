import { Jogador, Time, NIVEL_ORDEM, TIME_PALETA, TimeCor } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function sortearTimes(
  jogadores: Jogador[],
  porTime: number,
): { times: Time[]; reservas: Jogador[]; avisos: string[] } {
  const embaralhados = shuffle(jogadores);
  const qtdTimes = Math.floor(embaralhados.length / porTime);
  const usados = embaralhados.slice(0, qtdTimes * porTime);
  const reservas: Jogador[] = embaralhados.slice(qtdTimes * porTime);

  // Snake draft: ordena do maior para menor nível e distribui em zigue-zague
  const ordenados = [...usados].sort((a, b) => NIVEL_ORDEM[b.nivel] - NIVEL_ORDEM[a.nivel]);
  const timesArr: Jogador[][] = Array.from({ length: qtdTimes }, () => []);

  ordenados.forEach((jogador, i) => {
    const rodada = Math.floor(i / qtdTimes);
    const posNaRodada = i % qtdTimes;
    const idx = rodada % 2 === 0 ? posNaRodada : qtdTimes - 1 - posNaRodada;
    timesArr[idx].push(jogador);
  });

  // Restrição: máximo 1 Cone (nível C) por time
  const excedentesC: Jogador[] = [];
  timesArr.forEach((time) => {
    const cones = time.filter((j) => j.nivel === 'C');
    if (cones.length > 1) {
      for (const exc of cones.slice(1)) {
        time.splice(time.indexOf(exc), 1);
        excedentesC.push(exc);
      }
    }
  });

  const naoEncaixados: Jogador[] = [];
  for (const jogador of excedentesC) {
    const timeSemC = timesArr.find((t) => !t.some((j) => j.nivel === 'C'));
    if (timeSemC) {
      timeSemC.push(jogador);
    } else {
      naoEncaixados.push(jogador);
    }
  }

  reservas.push(...naoEncaixados);

  const avisos: string[] = [];
  if (naoEncaixados.length > 0) {
    const s = naoEncaixados.length;
    avisos.push(
      `${s} jogador${s > 1 ? 'es' : ''} nível C ${s > 1 ? 'foram movidos' : 'foi movido'} para reservas (limite de 1 por time)`,
    );
  }

  return {
    times: timesArr.map((jogadoresTime, i) => ({
      id: i,
      nome: `Time ${i + 1}`,
      cor: TIME_PALETA[i % TIME_PALETA.length] as TimeCor,
      jogadores: jogadoresTime,
      forca: jogadoresTime.reduce((acc, j) => acc + NIVEL_ORDEM[j.nivel], 0),
    })),
    reservas,
    avisos,
  };
}
