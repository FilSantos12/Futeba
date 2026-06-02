import { Jogador, Time, NIVEL_ORDEM } from '../types';

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const NOMES_TIMES = [
  'Esquadrão Alfa', 'Falcões', 'Tubarões', 'Leões', 'Cobras',
  'Dragões', 'Panteras', 'Trovões', 'Lobos', 'Tigres',
];

export function sortearTimes(
  jogadores: Jogador[],
  porTime: number,
): { times: Time[]; reservas: Jogador[]; avisos: string[] } {
  const embaralhados = shuffle(jogadores);
  const qtdTimes = Math.floor(embaralhados.length / porTime);
  const usados = embaralhados.slice(0, qtdTimes * porTime);
  const reservas: Jogador[] = embaralhados.slice(qtdTimes * porTime);

  // Snake draft: distribui do maior para menor nível alternando a direção por rodada
  const ordenados = [...usados].sort((a, b) => NIVEL_ORDEM[b.nivel] - NIVEL_ORDEM[a.nivel]);
  const timesArr: Jogador[][] = Array.from({ length: qtdTimes }, () => []);

  ordenados.forEach((jogador, i) => {
    const rodada = Math.floor(i / qtdTimes);
    const posNaRodada = i % qtdTimes;
    const idx = rodada % 2 === 0 ? posNaRodada : qtdTimes - 1 - posNaRodada;
    timesArr[idx].push(jogador);
  });

  // Restrição: máximo 1 jogador nível D por time
  const excedentesD: Jogador[] = [];
  timesArr.forEach((time) => {
    const jogadoresD = time.filter((j) => j.nivel === 'D');
    if (jogadoresD.length > 1) {
      for (const exc of jogadoresD.slice(1)) {
        time.splice(time.indexOf(exc), 1);
        excedentesD.push(exc);
      }
    }
  });

  // Tenta encaixar excedentes em times que ainda não têm nenhum D
  const naoEncaixados: Jogador[] = [];
  for (const jogador of excedentesD) {
    const timeSemD = timesArr.find((t) => !t.some((j) => j.nivel === 'D'));
    if (timeSemD) {
      timeSemD.push(jogador);
    } else {
      naoEncaixados.push(jogador);
    }
  }

  reservas.push(...naoEncaixados);

  const avisos: string[] = [];
  if (naoEncaixados.length > 0) {
    const s = naoEncaixados.length;
    avisos.push(
      `${s} jogador${s > 1 ? 'es' : ''} Cone ${s > 1 ? 'foram movidos' : 'foi movido'} para reservas por limite de nível D por time`,
    );
  }

  const nomesEmbaralhados = shuffle(NOMES_TIMES);

  return {
    times: timesArr.map((jogadoresTime, i) => ({
      id: i,
      nome: nomesEmbaralhados[i] ?? `Time ${i + 1}`,
      jogadores: jogadoresTime,
      forca: jogadoresTime.reduce((acc, j) => acc + NIVEL_ORDEM[j.nivel], 0),
    })),
    reservas,
    avisos,
  };
}
