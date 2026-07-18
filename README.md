# METANOIA

> Do grego μετάνοια — a transformação da mente. Um desafio de coragem por vez.

App PWA (Next.js) que une **ação imediata** e **profundidade**: para cada área da vida,
uma atitude concreta para fazer agora e uma pergunta que vai à raiz (medo, crença,
ganho oculto), ancorada na Palavra, no estoicismo e nos mestres. Inclui uma trilha de
**idiomas** (PT/EN/RU com pronúncia e áudio) e um **quiz**. Funciona offline, sem API.

## Seções

| Modo | O que faz |
|------|-----------|
| **Encarar** | Sorteia um desafio: *comportamento* (aja agora) + *pergunta* (encare a raiz) + âncora. Filtros por área (14) e intensidade (leve/médio/corajoso). Registra streak e total. |
| **Idiomas** | Frases do dia a dia em inglês e russo, com pronúncia aproximada em pt-BR e áudio via Web Speech API. |
| **Quiz** | Testa o vocabulário aprendido (PT → idioma alvo), com placar e progresso. |

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind v4** + CSS custom (glassmorphism, fundo aurora, tema claro/escuro)
- Persistência local via `localStorage` (`metanoia:progress`, `metanoia:theme`)
- Sem backend — offline-first

## Rodar localmente

```bash
npm install
npm run dev      # http://localhost:3000
```

```bash
npm run build    # build de produção
npm run lint     # eslint
```

## Estrutura

```
app/
  layout.tsx     # metadados, fundo aurora, tema sem flash
  page.tsx       # UI completa (3 modos)
  globals.css    # design system do app
lib/
  challenges.ts  # banco curado de desafios (comportamento + pergunta + âncora)
  phrases.ts     # frases PT/EN/RU
  speak.ts       # TTS (Web Speech API)
  useProgress.ts # streak e histórico (localStorage)
```
