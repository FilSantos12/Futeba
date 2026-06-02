# FUTEBA — Guia do projeto

App React + TypeScript para sorteio balanceado de times de futebol.
Usado exclusivamente em celular. Sem backend — tudo via localStorage.
PWA instalável em iOS (Safari) e Android (Chrome).

## Comandos

```bash
npm run dev      # servidor de desenvolvimento
npm run build    # TypeScript check + build Vite (sempre rodar antes de commitar)
npm run preview  # visualizar build localmente
node generate-icons.js  # regenerar icon-192.png e icon-512.png (requer sharp)
```

O deploy é automático: cada push ao branch `master` aciona o GitHub Actions
que faz o build e publica em `https://filsantos12.github.io/Futeba/`.

## Estrutura

```
src/
  types/index.ts            # todos os tipos e constantes de domínio
  hooks/useJogadores.ts     # estado global + localStorage
  utils/sortear.ts          # algoritmo de sorteio (snake draft)
  components/
    App.tsx                 # layout raiz, estado de tab e tema
    BottomNav.tsx           # navegação fixa no rodapé (mobile)
    CadastroForm.tsx        # formulário de adicionar jogador
    ListaJogadores.tsx      # lista com busca, edição, faltou
    SorteioTimes.tsx        # configuração e resultado do sorteio
    ShuffleAnimation.tsx    # animação de embaralhamento durante sorteio
    NivelBadge.tsx          # badge inline de nível (ícone SVG + label)
    NivelStars.tsx          # seletor interativo de nível (grid 2×2)
    Icons.tsx               # todos os ícones SVG do sistema (sem dependências externas)
  App.css                   # variáveis CSS de tema claro/escuro + keyframes de animação
public/
  manifest.json             # PWA manifest
  service-worker.js         # Cache First + runtime caching
  icons/
    icon.svg                # bola de futebol em fundo verde #16a34a
    icon-192.png            # gerado por generate-icons.js (sharp)
    icon-512.png            # gerado por generate-icons.js (sharp)
generate-icons.js           # script Node.js para gerar os PNGs a partir do SVG
```

## Domínio

### Níveis (`Nivel = 'C' | 'P' | 'B' | 'A'`)

| Letra | Ícone SVG | Label | Peso (`NIVEL_ORDEM`) | Cor do badge |
|-------|-----------|-------|----------------------|--------------|
| C | `IconCone` (cone laranja preenchido) | Não corre e nem marca | 1 | Laranja/vermelho |
| P | `IconSleepy` (zzz outline) | Preguiçoso | 2 | Amarelo |
| B | `IconRunner` (corredor outline) | Corre e marca | 3 | Azul |
| A | `IconStar` (estrela outline + fill 15%) | Joga bem | 4 | Verde |

- `NIVEL_LABELS` — texto exibido nos badges e seletores
- `NIVEL_ICONE` — referência textual (não usado para renderização; ícones vêm de `Icons.tsx`)
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

## Ícones SVG (`src/components/Icons.tsx`)

Arquivo único com todos os componentes de ícone. Nenhuma dependência externa (sem lucide, heroicons, etc.).
Props padrão: `size?: number` (default 18) e `color?: string` (default `'currentColor'`).
Todos usam `viewBox="0 0 24 24"`, `strokeLinecap="round"`, `strokeLinejoin="round"`.

| Componente | Uso |
|---|---|
| `IconCone` | Nível C — único ícone preenchido (filled), sem prop `color` |
| `IconSleepy` | Nível P |
| `IconRunner` | Nível B |
| `IconStar` | Nível A |
| `IconEdit` | Botão editar jogador |
| `IconTrash` | Botão remover jogador |
| `IconCheck` | Confirmar edição |
| `IconClose` | Cancelar edição |
| `IconSearch` | Decorativo no campo de busca |
| `IconExport` | Exportar JSON |
| `IconImport` | Importar JSON |
| `IconAbsent` | Marcar falta (pessoa + X) |
| `IconPresent` | Marcar presença (pessoa + check) |
| `IconShuffle` | Botão "Sortear Times" |

## Algoritmo de sorteio (`src/utils/sortear.ts`)

1. Recebe apenas jogadores **presentes** (`!j.faltou`) — filtro feito em `SorteioTimes`
2. Embaralha aleatoriamente
3. Calcula `qtdTimes = floor(n / porTime)`; excedentes vão para `reservas`
4. Ordena do maior para menor `NIVEL_ORDEM`
5. Snake draft: distribui em zigue-zague (rodadas pares: 0→N, ímpares: N→0)
6. **Restrição nível C:** máximo 1 jogador C por time — nível P não tem restrição
   - Excedentes C são movidos para lista temporária
   - Tenta reencaixá-los em times sem nenhum C
   - O que sobrar vai para `reservas` com aviso em `avisos[]`
7. Retorna `{ times, reservas, avisos }`

Pesos usam `NIVEL_ORDEM` de `types/index.ts` — nunca hardcodar números.

## Estado e persistência (`src/hooks/useJogadores.ts`)

Chave localStorage: `futeba_jogadores`

**Migração automática** na leitura — `migrarNivel()` converte dados antigos:
- Letras válidas `'A' | 'B' | 'P' | 'C'` → passam direto
- Letra `'D'` (sistema de 4 letras anterior) → `'C'`
- Numérico ≤1 → `'C'`, 2 → `'P'`, 3–4 → `'B'`, 5+ → `'A'`
- Default → `'C'`

A mesma migração é aplicada no `importar()`.

Funções expostas: `adicionar`, `remover`, `editar`, `toggleFaltou`, `importar`, `exportar`.

## Componentes principais

### `Icons.tsx`
Único ponto de entrada para todos os ícones. Não renderizar `NIVEL_ICONE[nivel]` diretamente —
sempre usar os componentes deste arquivo. Adicionar novos ícones aqui antes de usá-los.

### `NivelBadge`
Badge inline com ícone SVG + label do nível. `max-width: 130px` — o label trunca com ellipsis
se necessário (importante para "Não corre e nem marca" em telas pequenas).
`flexShrink: 0` — nunca encolhe no flex row da lista.

### `NivelStars`
Seletor de nível interativo. Props: `valor`, `onChange?`, `readonly?`, `size?`.
- Modo interativo: **grid 2×2** (4 níveis), `minHeight: 56px` por botão, ícone 22px + label 11px
- Cor do ícone muda conforme `selected`: cor do nível quando selecionado, `var(--text-secondary)` quando não
- Modo `readonly`: exibe ícone + label inline sem interação

### `ShuffleAnimation`
Exibida durante os 1,8 s de animação do sorteio. Mostra grade 3 colunas com os nomes dos
jogadores embaralhando a cada 200 ms via `setInterval`. Usa keyframe `futebaCardShuffle`.

### `ListaJogadores`
- Stats: Total / Presentes / Times de 6 (calculados sobre presentes)
- Toolbar: busca com ícone lupa overlay (paddingLeft 38px) + ordenação + exportar/importar
- Modo leitura: `[nome flex:1 1 80px] [badge max:130px] [ações flexShrink:0]`
  - Ações: botão faltou/voltou 32×32px circular + editar 28×28px + remover 28×28px
  - `overflow: hidden` no card impede vazamento; `gap: 6px`
- Modo edição: NivelStars em `flex:1` + label selecionado (11px, maxWidth 100px, wordBreak)
- Botões Salvar/Cancelar: ícones `IconCheck` / `IconClose` full-width

### `SorteioTimes`
- Exibe "Presentes X de Y" no contador
- Ao clicar "Sortear Times": inicia animação `ShuffleAnimation` por 1,8 s, depois exibe resultado
- Cards dos times com fade-in escalonado: `futebaFadeInUp`, `animationDelay: index * 150ms`
- Cards: header colorido (`cor.primary`), badge com nome da cor, barra de força proporcional
- Reservas: chips com `background: var(--input-bg)` + `color: var(--text)` (legível no dark mode)
- Botão "Sortear Times": `IconShuffle` + texto, layout flex centralizado

## Animações (`App.css`)

Keyframes adicionados ao final do arquivo:

| Nome | Uso |
|---|---|
| `futebaCardShuffle` | Cards na ShuffleAnimation (scale 0.88→1) |
| `futebaFadeInOut` | Texto "Sorteando..." (opacity pulse) |
| `futebaFadeInUp` | Cards dos times ao aparecer (translateY 14px→0) |

## PWA

- **Manifest**: `public/manifest.json` — `start_url: "."`, orientação portrait, ícones relativos `./icons/`
- **Service Worker**: `public/service-worker.js` — Cache First; pré-cacheia shell (`scope`, manifest, ícones); armazena qualquer fetch GET com status 200; limpa caches antigos no `activate`
- **Registro**: inline no `index.html` via `%BASE_URL%service-worker.js` (Vite substitui em build)
- **iOS**: meta tags `apple-mobile-web-app-*` + `apple-touch-icon`; instrução de instalação exibida após 2 s (apenas Safari fora do standalone)
- **Android**: captura `beforeinstallprompt`; exibe banner com botão "Instalar"
- **Ícones PNG**: gerados por `generate-icons.js` usando `sharp` (dev dependency); rodar após alterar `icon.svg`

## Tema

CSS variables em `App.css`. Tema escuro ativado pela classe `.dark` no elemento raiz.

| Variável | Claro | Escuro |
|---|---|---|
| `--bg` | `#f5f4f0` | `#141412` |
| `--card-bg` | `#ffffff` | `#1e1e1c` |
| `--input-bg` | `#ffffff` | `#252523` |
| `--text` | `#1a1a18` | `#f0ede6` |
| `--accent` | `#1a7a3c` | `#3dbb5c` |

Regras globais mobile: `touch-action: manipulation`, `font-size: 16px !important` em inputs (evita zoom iOS), `min-height/width: 44px` em botões (atenção: botões de ação na lista usam inline style para sobrescrever para 28–32px).

## Decisões relevantes

- **Sem backend, sem autenticação** — sistema local para uso em campo
- **`faltou` persiste** no localStorage — organizador marca antes da pelada
- **Migração silenciosa** — dados de versões anteriores (numérico, letra D, 3 níveis) convertidos automaticamente
- **Nomes de time fixos** — sempre "Time 1/2/3"; não usar nomes aleatórios
- **Restrição C por time** — máximo 1 "Não corre e nem marca" por time; nível P não tem restrição
- **Ícones inline** — zero dependências externas de ícones; tudo em `Icons.tsx`; `IconCone` é o único filled
- **`as TimeCor`** no `sortear.ts` — cast necessário porque TypeScript não estreita índice de `readonly` tuple com módulo
- **`%BASE_URL%`** em `index.html` — Vite substitui pelo base path (`/Futeba/`) em build; usar sempre para assets do PWA

## Deploy

- Repositório: `https://github.com/FilSantos12/Futeba`
- URL publicada: `https://filsantos12.github.io/Futeba/`
- `vite.config.ts`: `base: '/Futeba/'` (case-sensitive — deve bater com o nome do repo)
- Workflow: `.github/workflows/deploy.yml` — triggered em push ao `master`
- PWA funciona em produção (HTTPS obrigatório para Service Worker e `beforeinstallprompt`)
