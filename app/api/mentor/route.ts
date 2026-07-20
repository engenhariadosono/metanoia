import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 30;

const MENTOR_SYSTEM = `Você é o mentor do METANOIA — app de transformação (metanoia = mudança da mente).
Diante de uma PERGUNTA de raiz e (quando houver) a REFLEXÃO da pessoa, devolva UMA provocação socrática que aprofunde — nunca a resposta pronta.
Regras:
- 1 a 3 frases curtas, terminando SEMPRE com uma pergunta que expõe a crença, o medo ou o ganho oculto por trás.
- Tom firme, respeitoso, adulto. Sem clichês de autoajuda, sem elogio vazio, sem julgamento, sem diagnóstico clínico.
- Pode ancorar brevemente numa ideia estoica ou bíblica se couber, sem citar capítulo/versículo.
- Português do Brasil. Sem listas, sem passos, sem introdução do tipo "Ótima reflexão".
- Se a reflexão estiver vazia, provoque a partir da própria pergunta.
- Se houver REFLEXÕES ANTERIORES, note discretamente um padrão ou uma evolução (sem citar datas, sem repetir o que ela já disse) para aprofundar.`;

const STEPS_SYSTEM = `Você decompõe uma AÇÃO em exatamente 3 micropassos absurdamente pequenos e concretos, no imperativo.
- O primeiro leva menos de 2 minutos e é praticamente impossível de recusar (algo físico e imediato).
- Cada passo em UMA linha, sem numeração, sem marcadores, sem introdução.
- Português do Brasil. Nada além das 3 linhas.`;

const DECIDIR_SYSTEM = `Você é o mentor do METANOIA ajudando alguém dividido entre DUAS opções.
Sua função não é escolher por ela, e sim trazer CLAREZA sobre o que cada caminho revela.
Regras:
- 3 a 5 frases curtas. Aponte o medo por trás de cada opção e o valor que cada uma protege.
- Use no máximo uma das lentes clássicas (arrependimento daqui a 10 anos, conselho ao melhor amigo, custo de não decidir) se ajudar.
- Termine SEMPRE com UMA única pergunta que force a pessoa a nomear o que ela realmente quer.
- Tom firme, adulto, respeitoso. Sem clichês de autoajuda, sem decidir por ela, sem listas, sem introdução.
- Português do Brasil.`;

function str(v: unknown, max: number): string {
  return typeof v === "string" ? v.slice(0, max).trim() : "";
}

// Memória: até 3 reflexões anteriores da pessoa, saneadas.
function historyText(v: unknown): string {
  if (!Array.isArray(v)) return "";
  return v
    .slice(0, 3)
    .map((h) => {
      const hh = h as Record<string, unknown>;
      const q = str(hh?.question, 300);
      const body = str(hh?.body, 600);
      return body ? `- Sobre "${q}": ${body}` : "";
    })
    .filter(Boolean)
    .join("\n");
}

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "mentor_unconfigured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }

  const b = body as Record<string, unknown>;
  const mode =
    b?.mode === "steps"
      ? "steps"
      : b?.mode === "decidir"
        ? "decidir"
        : "mentor";
  const action = str(b?.action, 400);
  const question = str(b?.question, 500);
  const reflection = str(b?.reflection, 2000);
  const optionA = str(b?.optionA, 300);
  const optionB = str(b?.optionB, 300);

  if (mode === "mentor" && !question) {
    return Response.json({ error: "missing_question" }, { status: 400 });
  }
  if (mode === "steps" && !action) {
    return Response.json({ error: "missing_action" }, { status: 400 });
  }
  if (mode === "decidir" && !optionA && !optionB) {
    return Response.json({ error: "missing_options" }, { status: 400 });
  }

  const client = new Anthropic({ apiKey });

  const system =
    mode === "steps"
      ? STEPS_SYSTEM
      : mode === "decidir"
        ? DECIDIR_SYSTEM
        : MENTOR_SYSTEM;
  const userText =
    mode === "steps"
      ? `Ação: ${action}\n\nDê exatamente 3 micropassos.`
      : mode === "decidir"
        ? `Opção A: ${optionA || "(vazia)"}\nOpção B: ${optionB || "(vazia)"}\n\nDevolva a leitura de clareza.`
        : `${
            historyText(b?.history)
              ? `Reflexões anteriores da pessoa (memória — use para notar padrões, não repita):\n${historyText(b?.history)}\n\n`
              : ""
          }Pergunta de raiz: ${question}\nAção proposta: ${action || "(sem ação)"}\n\nReflexão da pessoa: ${reflection || "(ainda não escreveu)"}\n\nDevolva a provocação.`;

  try {
    const msg = await client.messages.create({
      model: "claude-opus-4-8",
      max_tokens: mode === "steps" ? 400 : 512,
      thinking: { type: "adaptive" },
      output_config: { effort: "low" },
      system,
      messages: [{ role: "user", content: userText }],
    });

    const text = msg.content
      .filter((blk): blk is Anthropic.TextBlock => blk.type === "text")
      .map((blk) => blk.text)
      .join("")
      .trim();

    if (mode === "steps") {
      const steps = text
        .split("\n")
        .map((line) => line.replace(/^\s*(?:[-•*]|\d+[.)])\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 3);
      if (steps.length === 0) {
        return Response.json({ error: "mentor_failed" }, { status: 502 });
      }
      return Response.json({ steps });
    }

    if (!text) {
      return Response.json({ error: "mentor_failed" }, { status: 502 });
    }
    return Response.json({ text });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      return Response.json({ error: "rate_limited" }, { status: 429 });
    }
    return Response.json({ error: "mentor_failed" }, { status: 502 });
  }
}
