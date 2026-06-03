# FUTEBA

App para sorteio balanceado de times de futebol. Feito para uso no celular, sem backend — tudo salvo localmente no navegador (localStorage). Instalável como PWA no iOS e Android.

**App:** [filsantos12.github.io/Futeba](https://filsantos12.github.io/Futeba/)

## Funcionalidades

- Cadastro de jogadores com nível de habilidade (C / P / B / A)
- Edição, remoção e marcação de falta por jogador
- Sorteio balanceado via snake draft com restrição de nível C por time
- Times configuráveis: 4 a 11 jogadores por time
- Exportar / importar lista de jogadores (JSON)
- Tema claro e escuro
- PWA instalável (iOS via Safari, Android via Chrome)

## Níveis

| Letra | Significado | Peso |
|-------|-------------|------|
| C | Não corre e nem marca | 1 |
| P | Preguiçoso | 2 |
| B | Corre e marca | 3 |
| A | Joga bem | 4 |

## Como o sorteio funciona

O algoritmo usa **snake draft**:

1. Filtra apenas jogadores presentes (sem `faltou`)
2. Embaralha aleatoriamente
3. Calcula quantos times cabem; excedentes viram reservas
4. Ordena do maior para o menor nível
5. Distribui em zigue-zague entre os times (rodadas pares: 0→N, ímpares: N→0)
6. Aplica restrição: máximo 1 jogador nível C por time — excedentes vão para reservas com aviso

## Tecnologias

- React 18 + TypeScript
- Vite
- localStorage (sem backend)
- PWA (manifest + service worker)
- GitHub Actions + GitHub Pages

## Comandos

```bash
npm install          # instalar dependências
npm run dev          # servidor de desenvolvimento
npm run build        # TypeScript check + build Vite
npm run preview      # visualizar build localmente
node generate-icons.js  # regenerar icon-192.png e icon-512.png (requer sharp)
```

O deploy é automático: cada push ao branch `master` aciona o GitHub Actions e publica em `https://filsantos12.github.io/Futeba/`.

## Estrutura

```
src/
  types/index.ts            # tipos e constantes de domínio
  hooks/useJogadores.ts     # estado global + localStorage
  utils/sortear.ts          # algoritmo de sorteio (snake draft)
  components/
    App.tsx                 # layout raiz, estado de tab e tema
    BottomNav.tsx           # navegação fixa no rodapé (mobile)
    CadastroForm.tsx        # formulário de adicionar jogador
    ListaJogadores.tsx      # lista com busca, edição, faltou
    SorteioTimes.tsx        # configuração e resultado do sorteio
    ShuffleAnimation.tsx    # animação de embaralhamento
    NivelBadge.tsx          # badge inline de nível
    NivelStars.tsx          # seletor interativo de nível (grid 2×2)
    Icons.tsx               # todos os ícones SVG (sem dependências externas)
  App.css                   # variáveis CSS de tema claro/escuro + keyframes
public/
  manifest.json             # PWA manifest
  service-worker.js         # Cache First + runtime caching
  icons/
    icon.svg
    icon-192.png
    icon-512.png
```
