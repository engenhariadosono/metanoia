<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Mapa deste app

Leia `ARQUITETURA.md` antes de qualquer ajuste. Ele traz a estrutura, o mapa do
`page.tsx` (1.4k linhas num componente só, cinco modos), os padrões que o código repete
e as receitas.

Quatro avisos que custam caro:

- **Deploy é automático pelo GitHub.** NÃO rodar `vercel --prod` — `git push` publica.
  Este é o único app do usuário assim.
- **`ANTHROPIC_API_KEY` só existe em Production**, então o Mentor não funciona em
  `next dev`. É configuração, não bug — confira a variável antes de depurar a rota.
- **Pureza do React 19:** `Date.now()` / `Math.random()` no corpo do componente quebram.
  Sempre em `useEffect` ou handler.
- **`localStorage` não existe no servidor** — todo `loadX()` precisa do guard.

A pasta é `encare`, o app é `metanoia`. Interface e textos em português do Brasil.
