# Mapa do Metanoia — estrutura e receitas de ajuste

PWA de desafios de coragem ("encare · aja · transforme"): comportamento + pergunta de
raiz + âncora bíblica/estoica. Público: jovens cristãos. Tema de **combate espiritual** —
masculino, sem borboletas.

Leia junto o `AGENTS.md` (→ `CLAUDE.md`): **este Next é 16.2.10 e tem breaking changes**;
a documentação real está em `node_modules/next/dist/docs/`.

## Antes de qualquer coisa

- ⚠️ **A pasta é `encare`, o app é `metanoia`.** Nomes divergem; não é engano.
- **Deploy é automático** a partir do GitHub (`engenhariadosono/metanoia`) — diferente dos
  outros apps do usuário, aqui **não se roda `vercel --prod` na mão**. Push na branch
  publica. No ar em `metanoia-pi.vercel.app`.
- **`ANTHROPIC_API_KEY` existe só em Production.** Não está em Preview, nem em
  Development, nem no `.env.local` — logo **o Mentor não funciona em `next dev`**. Isso é
  configuração, não bug. É a mesma chave da Planilha Estoica.
- **React 19 é estrito quanto a pureza:** `Date.now()` / `Math.random()` chamados durante
  o render disparam erro. Este app usa os dois bastante (sorteio de desafio, cronômetros)
  — sempre dentro de `useEffect` ou de handler, nunca no corpo do componente.

---

## 1. Estrutura

```
app/
  page.tsx        1.447 linhas — O APP INTEIRO. Um componente Home(), cinco modos
  layout.tsx      metadata, manifest, tema
  globals.css     23 KB — todo o sistema visual
  InstallButton.tsx  prompt de instalação PWA
  api/mentor/route.ts   a única rota de servidor — o Mentor IA
lib/
  challenges.ts   31 KB — O CONTEÚDO: baralho de desafios, categorias, âncoras
  phrases.ts      frases PT/EN/RU do modo Idiomas
  speak.ts        TTS via Web Speech API (nativa, sem custo)
  useProgress.ts  hook de progresso
```

Dependências: **next, react, @anthropic-ai/sdk, @vercel/analytics**. Só isso.

**Persistência é 100% local**, em `localStorage`, com chaves prefixadas `metanoia:` —
`progress`, `reflections`, `journal`, `plans`, `reminder`, `theme`, `schulte`, `stroop`.
Não há Supabase, não há login, não há sincronização entre aparelhos (ao contrário do Maná).

## 2. O `page.tsx` é quase-monolito

`export default function Home()` começa na **linha 209** e vai até o fim — ~1.240 linhas
num componente só, cobrindo os cinco modos. Antes dele, ~200 linhas de helpers puros:

| ~Linha | O quê |
|---|---|
| 19–22 | `type Mode` — os 5 modos: `encarar`, `idiomas`, `quiz`, `cerebro`, `decidir` |
| 26–53 | Baralho: `shuffle`, `filterDeck`, `pickId` |
| 55–77 | Idiomas/Quiz: `targetOf`, `langCode`, `buildQuiz` |
| 78–145 | Carregadores de `localStorage`: `initialTheme`, `loadReflections`, `loadJournal`, `loadPlans`, `loadBrain` |
| 146–207 | Cérebro/Decidir: `isoDay`, `fmtMs`, `makeTrial`, `loadStroop`, `coinFlip` |
| **209+** | **`Home()`** — estado, efeitos e o JSX dos 5 modos |

**Navegue por `Grep` no nome do helper ou no rótulo visível**, não por número de linha.

**Onde mexer, por tipo de ajuste:**

| Quero… | Mexo em |
|---|---|
| adicionar/editar desafio | só `lib/challenges.ts` — não toca em UI |
| mudar frase de idioma | só `lib/phrases.ts` |
| mexer num modo | a seção correspondente dentro de `Home()` |
| mudar o Mentor | `app/api/mentor/route.ts` |
| paleta/tipografia | `app/globals.css` |

---

## 3. Os padrões que o app repete

### A — Conteúdo separado de código
`challenges.ts` é o maior arquivo do projeto e é **só dado**: `Challenge`, `Anchor`,
`CategoryId`, `Intensity` (1 leve · 2 médio · 3 corajoso), `Tradition`
(`biblia` | `estoico` | `livro` | `filosofo`). Crescer o app quase sempre significa
crescer esse arquivo, sem tocar em React. **Preserve isso** — é o que mantém o custo de
adicionar conteúdo perto de zero.

### B — Estado local com carregador defensivo
Cada fatia tem um `loadX()` que lê `localStorage`, faz `JSON.parse` em `try/catch` e
devolve um default se qualquer coisa falhar. Chave nova segue `metanoia:<coisa>` e ganha
seu próprio `loadX()`. Nunca leia `localStorage` direto no corpo do componente (SSR +
pureza do React 19).

### C — Rota de IA com modos
`app/api/mentor/route.ts` é a única rota de servidor. Um endpoint, **três modos**
selecionados por `body.mode`:

| `mode` | Entrada | Saída |
|---|---|---|
| `mentor` | `question` | conselho |
| `steps` | `action` | micropassos |
| `decidir` | `optionA` / `optionB` | clareza na decisão |

Configuração atual (já moderna — **não precisa migrar**):
```ts
export const runtime = "nodejs";
export const maxDuration = 30;
model: "claude-opus-4-8",
thinking: { type: "adaptive" },
output_config: { effort: "low" },
max_tokens: mode === "steps" ? 400 : 512,
```
Cada modo valida sua própria entrada e rejeita cedo. Modo novo = uma entrada na validação,
um prompt e um ramo de parsing. A chave **nunca** chega ao cliente.

### D — Recursos nativos do navegador, não bibliotecas
TTS pelo Web Speech API (`lib/speak.ts`), instalação PWA pelo `beforeinstallprompt`
(`InstallButton.tsx`), animações em CSS puro. Zero dependência de UI. O app inteiro tem
4 dependências — **essa magreza é uma decisão, não um acidente.**

### E — Animação respeita `prefers-reduced-motion`
A celebração do "Encarei" (onda de choque + fagulhas na classe `.strike`) é decorativa e
some quando o usuário pede menos movimento. Nota de dev: o ambiente de teste do Claude
tem `reduce` ligado — animação invisível ali **não é bug**.

---

## 4. Receitas

**① Desafio novo (~2 min)** — uma entrada em `lib/challenges.ts` com categoria,
intensidade e âncora. Nada mais.

**② Ajuste de UI num modo (~10 min)** — achar a seção dentro de `Home()` pelo rótulo
visível e editar. Cuidado com pureza: nada de `Date.now()`/`Math.random()` no render.

**③ Fatia de estado nova (~15 min)** — `loadX()` defensivo + chave `metanoia:x` + `useEffect`
que persiste. Seguir o padrão B.

**④ Modo novo no Mentor (~30 min)** — validação + prompt + ramo de parsing no
`route.ts`, e o gatilho na UI. Manter `effort: "low"` e o `max_tokens` apertado: as
respostas são curtas por design.

**⑤ Publicar**
```powershell
npm run build          # tem que passar limpo
git push               # o deploy sai sozinho — NÃO rodar vercel --prod
```

---

## 5. Armadilhas

- **Pureza do React 19** é a que mais morde aqui: `Date.now()`/`Math.random()` no render
  quebram. Sortear desafio, cronometrar e embaralhar sempre em efeito ou handler.
- **`localStorage` não existe no servidor.** Todo `loadX()` precisa do guard; ler direto
  no corpo do componente quebra o build.
- **Não rodar `vercel --prod`** — este é o único app do usuário com deploy automático.
  Publicar na mão cria deployment fora do fluxo do GitHub.
- **Mentor não responde em dev** — chave só em Production. Não perca tempo depurando a
  rota; confira a variável de ambiente primeiro.
- **`page.tsx` é grande**: use `Edit` cirúrgico com âncora única, nunca reescreva o arquivo.
- **Ícone é espada com punho em cruz** (Ef 6:17), não borboleta — foi trocado a pedido.
  Vale para `app/icon.svg`, `apple-icon.png` e os PNGs de `public/`.

---

## 6. Aberto

- **Chave em Development/Preview** — destravaria o Mentor no `next dev`. Depende do usuário.
- **Sem sincronização entre aparelhos.** Trocar de celular perde tudo. O Maná já resolveu
  isso com Supabase + magic link ([[project-biblia-vs-tela]]) — o padrão está pronto para
  ser copiado, se algum dia valer.
- **Sem testes.** Não há runner configurado; os helpers puros do topo do `page.tsx`
  (`filterDeck`, `pickId`, `buildQuiz`, `makeTrial`) seriam o primeiro alvo óbvio.
- **`page.tsx` como componente único** é o limite estrutural. Ainda cabe, mas o próximo
  modo provavelmente pede extração dos modos em componentes.
