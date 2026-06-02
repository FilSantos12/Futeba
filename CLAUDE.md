# FUTEBA — Guia do projeto

App React + TypeScript para sorteio balanceado de times de futebol.
Usado exclusivamente em celular. Sem backend — tudo via localStorage.

## Comandos

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # TypeScript check + build Vite (sempre rodar antes de commitar)
npm run preview  # visualizar build localmente
```

O deploy é automático: cada push ao branch `master` aciona o GitHub Actions
que faz o build e publica em `https://filsantos12.github.io/Futeba/`.

## Estrutura

```
src/
  types/index.ts          # todos os tipos e constantes de domínio
  hooks/useJogadores.ts   # estado global + localStorage
  utils/sortear.ts        # algoritmo de sorteio (snake draft)
  components/
    App.tsx               # layout raiz, estado de tab e tema
    BottomNav.tsx         # navegação fixa no rodapé (mobile)
    CadastroForm.tsx      # formulário de adicionar jogador
    ListaJogadores.tsx    # lista com busca, edição, faltou
    SorteioTimes.tsx      # configuração e resultado do sorteio
    NivelBadge.tsx        # badge inline de nível (ícone + label)
    NivelStars.tsx        # seletor interativo de nível (3 botões)
  App.css                 # variáveis CSS de tema claro/escuro
```

## Domínio

### Níveis (`Nivel = 'C' | 'B' | 'A'`)

| Letra | Ícone | Label | Peso (`NIVEL_ORDEM`) | Cor do badge |
|-------|-------|-------|----------------------|--------------|
| C | 🔺 | Não corre e nem marca | 1 | Laranja/vermelho |
| B | 🏃 | Corre e marca | 2 | Azul |
| A | ⭐ | Joga bem | 3 | Verde |

- `NIVEL_LABELS` — texto exibido nos badges e seletores
- `NIVEL_ICONE` — emoji do nível
- `NIVEL_CORES` — `{ bg, text, border }` para estilos inline
- `NIVEL_ORDEM` — peso numérico usado no sorteio e na ordenação da lista

### Jogador

```ts
interface Jogador {
  id: string;       // crypto.randomUUID()
  nome: string;
  nivel: Nivel;
  faltou?: boolean; // ausência na pelada; exclui do sorteio
  criadoEm: number; // timestamp
}
```

`faltou` é persistido no localStorage. `undefined` equivale a presente.

### Time

```ts
interface Time {
  id: number;
  nome: string;     // sempre "Time 1", "Time 2", ...
  cor: TimeCor;     // entrada de TIME_PALETA (primary, text, border, badge, nome)
  jogadores: Jogador[];
  forca: number;    // soma de NIVEL_ORDEM de cada jogador
}
```

`TIME_PALETA` tem 6 cores nomeadas (Vermelho, Azul, Verde, Amarelo, Roxo, Rosa).
A cor é atribuída por índice: `TIME_PALETA[i % TIME_PALETA.length]`.

## Algoritmo de sorteio (`src/utils/sortear.ts`)

1. Recebe apenas jogadores **presentes** (`!j.faltou`) — filtro feito em `SorteioTimes`
2. Embaralha aleatoriamente
3. Calcula `qtdTimes = floor(n / porTime)`; excedentes vão para `reservas`
4. Ordena do maior para menor `NIVEL_ORDEM`
5. Snake draft: distribui em zigue-zague (rodadas pares: 0→N, ímpares: N→0)
6. **Restrição nível C:** máximo 1 jogador C por time
   - Excedentes são movidos para uma lista temporária
   - Tenta reencaixá-los em times sem nenhum C
   - O que sobrar vai para `reservas` com aviso em `avisos[]`
7. Retorna `{ times, reservas, avisos }`

## Estado e persistência (`src/hooks/useJogadores.ts`)

Chave localStorage: `futeba_jogadores`

**Migração automática** na leitura — `migrarNivel()` converte dados antigos:
- Números 1–2 → `'C'`, 3–4 → `'B'`, 5 → `'A'`
- Letra `'D'` (sistema anterior de 4 letras) → `'C'`
- Valores já válidos passam direto

A mesma migração é aplicada no `importar()`.

Funções expostas: `adicionar`, `remover`, `editar`, `toggleFaltou`, `importar`, `exportar`.

## Componentes principais

### `NivelStars`
Seletor de nível interativo. Props: `valor`, `onChange?`, `readonly?`, `size?`.
- Modo interativo: 3 botões iguais, `minHeight: 56px`, ícone 22px + label 11px
- Modo `readonly`: exibe só ícone + label inline sem interação

### `NivelBadge`
Badge inline: `🔺 Não corre e nem marca`. Lê de `NIVEL_ICONE` e `NIVEL_LABELS`.
Estilos de cor vindos de `NIVEL_CORES`.

### `ListaJogadores`
- Stats: Total / Presentes / Times de 6 (calculados sobre presentes)
- Toolbar em 2 linhas: busca (linha 1) · ordenação + exportar/importar (linha 2)
- Ordenação: ausentes sempre ao final, depois por nível ou nome
- Botão **Faltou / Voltou** em cada item (pill colorido)
- Edição inline em coluna única com `NivelStars` + botões Salvar/Cancelar full-width

### `SorteioTimes`
- Exibe apenas jogadores **presentes** no contador ("Presentes X de Y")
- Sorteia somente presentes
- Cards: header colorido (`cor.primary`), badge com nome da cor, barra de força proporcional
- Reservas: chips com `background: var(--input-bg)` + `color: var(--text)` (garante leitura no dark mode)

## Tema

CSS variables em `App.css`. Tema escuro ativado pela classe `.dark` no elemento raiz.

| Variável | Claro | Escuro |
|---|---|---|
| `--bg` | `#f5f4f0` | `#141412` |
| `--card-bg` | `#ffffff` | `#1e1e1c` |
| `--input-bg` | `#ffffff` | `#252523` |
| `--text` | `#1a1a18` | `#f0ede6` |
| `--accent` | `#1a7a3c` | `#3dbb5c` |

Regras globais mobile: `touch-action: manipulation`, `font-size: 16px !important` em inputs (evita zoom iOS), `min-height/width: 44px` em botões.

## Decisões relevantes

- **Sem backend, sem autenticação** — sistema local para uso em campo
- **`faltou` persiste** no localStorage — o organizador marca antes da pelada e os dados ficam até que toglem de volta
- **Migração silenciosa** — dados de versões anteriores (numéricos, letra D) são convertidos automaticamente sem perda
- **Nomes de time fixos** — sempre "Time 1/2/3" por simplicidade; não usar nomes aleatórios
- **Restrição C por time** — nunca mais de 1 "Não corre e nem marca" por time para equilibrar
- **`as TimeCor`** no `sortear.ts` — cast necessário porque TypeScript não estreita o índice de acesso em `readonly` tuple com módulo

## Deploy

- Repositório: `https://github.com/FilSantos12/Futeba`
- URL publicada: `https://filsantos12.github.io/Futeba/`
- `vite.config.ts`: `base: '/Futeba/'` (case-sensitive — deve bater com o nome do repo)
- Workflow: `.github/workflows/deploy.yml` — triggered em push ao `master`
