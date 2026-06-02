# ⚽ FUTEBA

Sistema de cadastro e sorteio balanceado de times de futebol.

## Funcionalidades

- ✅ Cadastro de jogadores com nível de 1 a 5 estrelas
- ✅ Edição e remoção de jogadores
- ✅ Sorteio balanceado (snake draft — distribui os melhores entre os times)
- ✅ Times configuráveis: 4, 5, 6, 7, 8, 9, 10 ou 11 jogadores por time
- ✅ Exportar/importar lista de jogadores (JSON)
- ✅ Exportar resultado do sorteio (TXT)
- ✅ Tema claro e escuro
- ✅ Dados salvos localmente no navegador (localStorage)

## Tecnologias

- React 18 + TypeScript
- Vite
- localStorage (sem backend)
- GitHub Pages (hospedagem gratuita)

## Como rodar localmente

```bash
npm install
npm run dev
```

## Deploy no GitHub Pages

### 1. Configure o repositório

Crie um repositório no GitHub chamado `futeba`.

### 2. Atualize o package.json

Substitua `SEU_USUARIO` pelo seu nome de usuário do GitHub no campo `homepage`:

```json
"homepage": "https://SEU_USUARIO.github.io/futeba"
```

### 3. Configure o remote e faça o primeiro push

```bash
git init
git add .
git commit -m "feat: FUTEBA inicial"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/futeba.git
git push -u origin main
```

### 4. Deploy

```bash
npm run deploy
```

Isso vai fazer o build e publicar o conteúdo da pasta `dist` no branch `gh-pages`.

### 5. Configure o GitHub Pages

No repositório → Settings → Pages → Source: **Deploy from branch** → Branch: `gh-pages` → `/root`

Após alguns minutos, o site estará em:
`https://SEU_USUARIO.github.io/futeba`

## Estrutura do projeto

```
futeba/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── CadastroForm.tsx     # Formulário de cadastro
│   │   ├── ListaJogadores.tsx   # Lista com busca e edição
│   │   ├── NivelBadge.tsx       # Badge colorido de nível
│   │   ├── NivelStars.tsx       # Estrelas interativas
│   │   └── SorteioTimes.tsx     # Sorteio e exibição dos times
│   ├── hooks/
│   │   └── useJogadores.ts      # Estado + localStorage
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   ├── utils/
│   │   └── sortear.ts           # Algoritmo de sorteio balanceado
│   ├── App.tsx                  # Componente raiz + roteamento de tabs
│   ├── App.css                  # Variáveis CSS + tema dark/light
│   └── main.tsx                 # Entrada da aplicação
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Como o sorteio balanceado funciona

O algoritmo usa **snake draft**:

1. Embaralha os jogadores aleatoriamente
2. Ordena do maior para o menor nível
3. Distribui em zigue-zague entre os times:
   - Rodada par: times 1, 2, 3, 4...
   - Rodada ímpar: times 4, 3, 2, 1...
4. Garante que todos os times ficam com força similar

## Próximos passos (opcional)

Para sincronizar dados entre dispositivos, integre com:

- **Firebase Firestore** (gratuito até 1GB)
- **Supabase** (gratuito até 500MB)
- **GitHub Gist API** (gratuito, salva um JSON no Gist)
