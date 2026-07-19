"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CHALLENGES,
  CATEGORIES,
  CATEGORY_ORDER,
  INTENSITY,
  type Challenge,
  type CategoryId,
  type Intensity,
} from "@/lib/challenges";
import { THEMES, ALL_PHRASES, type Phrase } from "@/lib/phrases";
import { useProgress } from "@/lib/useProgress";
import { speak, warmVoices } from "@/lib/speak";

type Mode = "encarar" | "idiomas" | "quiz" | "cerebro" | "decidir";
type CatFilter = CategoryId | "todas";
type IntFilter = Intensity | "todas";
type Lang = "en" | "ru";

const QUIZ_LEN = Math.min(8, ALL_PHRASES.length);

function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function filterDeck(cat: CatFilter, int: IntFilter): Challenge[] {
  return CHALLENGES.filter(
    (c) =>
      (cat === "todas" || c.category === cat) &&
      (int === "todas" || c.intensity === int),
  );
}

function pickId(pool: Challenge[], exclude?: string | null): string | null {
  if (pool.length === 0) return null;
  if (pool.length === 1) return pool[0].id;
  let id = exclude ?? null;
  let guard = 0;
  while ((id === exclude || id == null) && guard < 24) {
    id = pool[Math.floor(Math.random() * pool.length)].id;
    guard++;
  }
  return id;
}

const targetOf = (p: Phrase, lang: Lang) => (lang === "en" ? p.en : p.ru);
const langCode = (lang: Lang) => (lang === "en" ? "en-US" : "ru-RU");
const langName = (lang: Lang) => (lang === "en" ? "inglês" : "russo");

interface QuizQ {
  pt: string;
  correct: string;
  options: string[];
}

function buildQuiz(lang: Lang): QuizQ[] {
  const picked = shuffle(ALL_PHRASES).slice(0, QUIZ_LEN);
  return picked.map((p) => {
    const correct = targetOf(p, lang);
    const distractors = shuffle(
      ALL_PHRASES.filter((x) => targetOf(x, lang) !== correct),
    )
      .slice(0, 3)
      .map((x) => targetOf(x, lang));
    return { pt: p.pt, correct, options: shuffle([correct, ...distractors]) };
  });
}

function initialTheme(): "dark" | "light" {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.getAttribute("data-theme") === "light"
    ? "light"
    : "dark";
}

// Micropassos garantidos mesmo sem IA (regra dos 2 minutos).
const FALLBACK_STEPS = [
  "Remova uma distração à sua frente e respire fundo uma vez.",
  "Faça a menor versão possível disto por apenas 2 minutos.",
  "Ao fim dos 2 minutos, decida continuar — quase sempre você segue.",
];

function loadReflections(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("metanoia:reflections") || "{}");
  } catch {
    return {};
  }
}

function loadPlans(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("metanoia:plans") || "{}");
  } catch {
    return {};
  }
}

interface Brain {
  best: number | null;
  streak: number;
  lastDate: string | null;
  plays: number;
}

function loadBrain(): Brain {
  const def: Brain = { best: null, streak: 0, lastDate: null, plays: 0 };
  if (typeof window === "undefined") return def;
  try {
    return {
      ...def,
      ...JSON.parse(localStorage.getItem("metanoia:schulte") || "{}"),
    };
  } catch {
    return def;
  }
}

function isoDay(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA");
}

function fmtMs(ms: number): string {
  return (ms / 1000).toFixed(1) + "s";
}

// Fonte de tempo isolada em módulo (evita chamar Date.now durante o render).
function nowMs(): number {
  return Date.now();
}

// ---- Stroop ("Cores"): controle executivo / inibição ----
const STROOP_TRIALS = 20;
const COLORS = [
  { name: "Vermelho", hex: "#e2604a" },
  { name: "Azul", hex: "#3aa0e0" },
  { name: "Verde", hex: "#4bbf7b" },
  { name: "Roxo", hex: "#7c5cff" },
  { name: "Amarelo", hex: "#e0a13a" },
];

interface Trial {
  wordIdx: number;
  inkIdx: number;
  opts: number[];
}

function makeTrial(): Trial {
  const wordIdx = Math.floor(Math.random() * COLORS.length);
  let inkIdx = Math.floor(Math.random() * COLORS.length);
  if (inkIdx === wordIdx) {
    inkIdx =
      (wordIdx + 1 + Math.floor(Math.random() * (COLORS.length - 1))) %
      COLORS.length;
  }
  const distractors = shuffle(
    COLORS.map((_, i) => i).filter((i) => i !== inkIdx),
  ).slice(0, 3);
  return { wordIdx, inkIdx, opts: shuffle([inkIdx, ...distractors]) };
}

function loadStroop(): Brain {
  const def: Brain = { best: null, streak: 0, lastDate: null, plays: 0 };
  if (typeof window === "undefined") return def;
  try {
    return {
      ...def,
      ...JSON.parse(localStorage.getItem("metanoia:stroop") || "{}"),
    };
  } catch {
    return def;
  }
}

// Sorteio isolado em módulo (evita Math.random durante o render).
function coinFlip(): "A" | "B" {
  return Math.random() < 0.5 ? "A" : "B";
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("encarar");
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);

  // ---- Encarar ----
  const [catFilter, setCatFilter] = useState<CatFilter>("todas");
  const [intFilter, setIntFilter] = useState<IntFilter>("todas");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const [celebrate, setCelebrate] = useState(0);

  // ---- Idiomas / Quiz ----
  const [lang, setLang] = useState<Lang>("en");
  const [quizRound, setQuizRound] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);

  // ---- Aprimoramento IA: micropassos, reflexão, mentor ----
  const [reflections, setReflections] =
    useState<Record<string, string>>(loadReflections);
  const [stepsById, setStepsById] = useState<Record<string, string[]>>({});
  const [stepsLoading, setStepsLoading] = useState(false);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [mentorById, setMentorById] = useState<
    Record<string, { text?: string; error?: string }>
  >({});
  const [mentorLoading, setMentorLoading] = useState(false);

  // ---- Gênio: plano Se → Então (implementação de intenção) ----
  const [plans, setPlans] = useState<Record<string, string>>(loadPlans);

  // ---- Cérebro: Tabela de Schulte (neuroplasticidade) ----
  const [brain, setBrain] = useState<Brain>(loadBrain);
  const [grid, setGrid] = useState<number[]>([]);
  const [nextNum, setNextNum] = useState(1);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [finishedMs, setFinishedMs] = useState<number | null>(null);
  const [wrongCell, setWrongCell] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [brainGame, setBrainGame] = useState<"schulte" | "stroop">("schulte");

  // Stroop
  const [stroopStats, setStroopStats] = useState<Brain>(loadStroop);
  const [stroopTrial, setStroopTrial] = useState<Trial | null>(null);
  const [stroopI, setStroopI] = useState(0);
  const [stroopStart, setStroopStart] = useState<number | null>(null);
  const [stroopMs, setStroopMs] = useState<number | null>(null);
  const [stroopFlash, setStroopFlash] = useState(false);

  // Decidir
  const [decA, setDecA] = useState("");
  const [decB, setDecB] = useState("");
  const [coin, setCoin] = useState<"A" | "B" | "flipping" | null>(null);
  const [decMentor, setDecMentor] = useState<{
    text?: string;
    error?: string;
  } | null>(null);
  const [decLoading, setDecLoading] = useState(false);

  const { streak, totalDone, doneToday, markDone } = useProgress();

  const deck = useMemo(
    () => filterDeck(catFilter, intFilter),
    [catFilter, intFilter],
  );
  const current = deck.find((c) => c.id === currentId) ?? deck[0] ?? null;

  // quizRound é um gatilho intencional para sortear uma nova rodada.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const quiz = useMemo(() => buildQuiz(lang), [lang, quizRound]);
  const q = quiz[quizIdx];

  // Inicialização client-only: revela dados de storage/TTS e sorteia o 1º card.
  useEffect(() => {
    /* eslint-disable react-hooks/set-state-in-effect */
    setMounted(true);
    warmVoices();
    setCurrentId(pickId(CHALLENGES));
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  // Cronômetro vivo dos jogos do Cérebro (setState só no callback do interval).
  const brainRunning =
    mode === "cerebro" &&
    ((brainGame === "schulte" && startedAt !== null && finishedMs === null) ||
      (brainGame === "stroop" && stroopStart !== null && stroopMs === null));
  useEffect(() => {
    if (!brainRunning) return;
    const iv = window.setInterval(() => setNow(nowMs()), 100);
    return () => window.clearInterval(iv);
  }, [brainRunning]);

  function toggleTheme() {
    const t = theme === "dark" ? "light" : "dark";
    setTheme(t);
    if (t === "light")
      document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
    try {
      localStorage.setItem("metanoia:theme", t);
    } catch {
      /* ignore */
    }
  }

  function applyCat(c: CatFilter) {
    setCatFilter(c);
    setCurrentId(pickId(filterDeck(c, intFilter)));
  }

  function applyInt(i: IntFilter) {
    setIntFilter(i);
    setCurrentId(pickId(filterDeck(catFilter, i)));
  }

  function next() {
    setCurrentId(pickId(deck, current?.id));
  }

  function done() {
    if (!current) return;
    markDone(current.id);
    setPulse(true);
    setCelebrate((c) => c + 1);
    window.setTimeout(() => setPulse(false), 500);
    window.setTimeout(next, 280);
  }

  function newRound() {
    setQuizIdx(0);
    setScore(0);
    setAnswered(null);
    setQuizRound((r) => r + 1);
  }

  function answer(opt: string) {
    if (answered || !q) return;
    setAnswered(opt);
    if (opt === q.correct) setScore((s) => s + 1);
  }

  function nextQuiz() {
    if (quizIdx + 1 >= quiz.length) {
      newRound();
    } else {
      setQuizIdx((i) => i + 1);
      setAnswered(null);
    }
  }

  function changeLang(l: Lang) {
    if (l === lang) return;
    setLang(l);
    setQuizIdx(0);
    setScore(0);
    setAnswered(null);
  }

  function setReflection(id: string, text: string) {
    setReflections((prev) => {
      const nextR = { ...prev, [id]: text };
      try {
        localStorage.setItem("metanoia:reflections", JSON.stringify(nextR));
      } catch {
        /* ignore */
      }
      return nextR;
    });
  }

  function toggleCheck(id: string, i: number) {
    const key = `${id}#${i}`;
    setChecked((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function askSteps() {
    if (!current || stepsLoading) return;
    const id = current.id;
    setStepsLoading(true);
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "steps", action: current.action }),
      });
      const data = await res.json();
      const steps =
        res.ok && Array.isArray(data.steps) && data.steps.length
          ? (data.steps as string[])
          : FALLBACK_STEPS;
      setStepsById((m) => ({ ...m, [id]: steps }));
    } catch {
      setStepsById((m) => ({ ...m, [id]: FALLBACK_STEPS }));
    } finally {
      setStepsLoading(false);
    }
  }

  async function askMentor() {
    if (!current || mentorLoading) return;
    const id = current.id;
    setMentorLoading(true);
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          mode: "mentor",
          question: current.question,
          action: current.action,
          reflection: reflections[id] ?? "",
        }),
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setMentorById((m) => ({ ...m, [id]: { text: data.text as string } }));
      } else {
        const error =
          data?.error === "mentor_unconfigured"
            ? "O mentor ainda não foi ativado (falta a chave da API no servidor)."
            : data?.error === "rate_limited"
              ? "Muitas perguntas agora. Tente em instantes."
              : "O mentor não respondeu. Tente de novo.";
        setMentorById((m) => ({ ...m, [id]: { error } }));
      }
    } catch {
      setMentorById((m) => ({
        ...m,
        [id]: { error: "Sem conexão com o mentor." },
      }));
    } finally {
      setMentorLoading(false);
    }
  }

  function setPlan(id: string, text: string) {
    setPlans((prev) => {
      const nextP = { ...prev, [id]: text };
      try {
        localStorage.setItem("metanoia:plans", JSON.stringify(nextP));
      } catch {
        /* ignore */
      }
      return nextP;
    });
  }

  function startSchulte() {
    setGrid(shuffle(Array.from({ length: 25 }, (_, i) => i + 1)));
    setNextNum(1);
    setStartedAt(null);
    setFinishedMs(null);
    setWrongCell(null);
  }

  function tapCell(n: number) {
    if (finishedMs !== null) return;
    if (n !== nextNum) {
      setWrongCell(n);
      window.setTimeout(() => setWrongCell(null), 300);
      return;
    }
    const start = startedAt ?? nowMs();
    if (startedAt === null) {
      setStartedAt(start);
      setNow(start);
    }
    if (n === 25) {
      const ms = nowMs() - start;
      setFinishedMs(ms);
      setBrain((prev) => {
        const today = isoDay();
        let streak: number;
        if (prev.lastDate === today) streak = prev.streak || 1;
        else if (prev.lastDate === isoDay(-1)) streak = prev.streak + 1;
        else streak = 1;
        const best = prev.best === null ? ms : Math.min(prev.best, ms);
        const nextB: Brain = {
          best,
          streak,
          lastDate: today,
          plays: prev.plays + 1,
        };
        try {
          localStorage.setItem("metanoia:schulte", JSON.stringify(nextB));
        } catch {
          /* ignore */
        }
        return nextB;
      });
    } else {
      setNextNum(n + 1);
    }
  }

  function startStroop() {
    setStroopI(0);
    setStroopStart(null);
    setStroopMs(null);
    setStroopFlash(false);
    setStroopTrial(makeTrial());
    setNow(0);
  }

  function answerStroop(colorIdx: number) {
    if (!stroopTrial || stroopMs !== null) return;
    if (colorIdx !== stroopTrial.inkIdx) {
      setStroopFlash(true);
      window.setTimeout(() => setStroopFlash(false), 260);
      return;
    }
    const start = stroopStart ?? nowMs();
    if (stroopStart === null) {
      setStroopStart(start);
      setNow(start);
    }
    const done = stroopI + 1;
    if (done >= STROOP_TRIALS) {
      const ms = nowMs() - start;
      setStroopI(done);
      setStroopMs(ms);
      setStroopStats((prev) => {
        const today = isoDay();
        let streak: number;
        if (prev.lastDate === today) streak = prev.streak || 1;
        else if (prev.lastDate === isoDay(-1)) streak = prev.streak + 1;
        else streak = 1;
        const best = prev.best === null ? ms : Math.min(prev.best, ms);
        const nextS: Brain = {
          best,
          streak,
          lastDate: today,
          plays: prev.plays + 1,
        };
        try {
          localStorage.setItem("metanoia:stroop", JSON.stringify(nextS));
        } catch {
          /* ignore */
        }
        return nextS;
      });
    } else {
      setStroopI(done);
      setStroopTrial(makeTrial());
    }
  }

  function flipCoin() {
    if (coin === "flipping") return;
    setCoin("flipping");
    setDecMentor(null);
    window.setTimeout(() => setCoin(coinFlip()), 750);
  }

  async function askDecision() {
    if (decLoading) return;
    const a = decA.trim();
    const b = decB.trim();
    if (!a && !b) return;
    setDecLoading(true);
    try {
      const res = await fetch("/api/mentor", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ mode: "decidir", optionA: a, optionB: b }),
      });
      const data = await res.json();
      if (res.ok && data.text) {
        setDecMentor({ text: data.text as string });
      } else {
        setDecMentor({
          error:
            data?.error === "mentor_unconfigured"
              ? "O mentor ainda não foi ativado (falta a chave da API no servidor)."
              : "O mentor não respondeu. Tente de novo.",
        });
      }
    } catch {
      setDecMentor({ error: "Sem conexão com o mentor." });
    } finally {
      setDecLoading(false);
    }
  }

  return (
    <main className="stage">
      <header className="topbar">
        <div className="wordmark">
          METANOIA
          <small>encare · aja · transforme</small>
        </div>
        <div className="topbar-actions">
          {mounted && streak > 0 && (
            <span className="iconbtn flame" title="Dias seguidos encarando">
              🔥 {streak}
            </span>
          )}
          <button
            className="iconbtn"
            onClick={toggleTheme}
            aria-label="Alternar tema claro e escuro"
          >
            {mounted ? (theme === "dark" ? "☀️" : "🌙") : "◐"}
          </button>
        </div>
      </header>

      <nav className="tabs">
        <button
          className={`tab ${mode === "encarar" ? "on" : ""}`}
          onClick={() => setMode("encarar")}
        >
          Encarar
        </button>
        <button
          className={`tab ${mode === "idiomas" ? "on" : ""}`}
          onClick={() => setMode("idiomas")}
        >
          Idiomas
        </button>
        <button
          className={`tab ${mode === "quiz" ? "on" : ""}`}
          onClick={() => setMode("quiz")}
        >
          Quiz
        </button>
        <button
          className={`tab ${mode === "cerebro" ? "on" : ""}`}
          onClick={() => setMode("cerebro")}
        >
          Cérebro
        </button>
        <button
          className={`tab ${mode === "decidir" ? "on" : ""}`}
          onClick={() => setMode("decidir")}
        >
          Decidir
        </button>
      </nav>

      {/* ---------------- ENCARAR ---------------- */}
      {mode === "encarar" && (
        <>
          <div className="card-wrap">
            {current ? (
              <article className="card enter" key={current.id}>
                <div className="card-head">
                  <span className="chip">
                    <span className="emoji">
                      {CATEGORIES[current.category].emoji}
                    </span>
                    {CATEGORIES[current.category].label}
                  </span>
                  <span className="intensity">
                    <span
                      className="dot"
                      style={{
                        color: INTENSITY[current.intensity].color,
                        background: INTENSITY[current.intensity].color,
                      }}
                    />
                    {INTENSITY[current.intensity].label}
                  </span>
                </div>

                <div className="eyebrow">Aja agora</div>
                <h1 className="action">{current.action}</h1>

                {mounted && (
                  <div className="assist">
                    <div className="assist-label">Comece pequeno</div>
                    {stepsById[current.id] ? (
                      <ol className="steps-list">
                        {stepsById[current.id].map((s, i) => {
                          const on = !!checked[`${current.id}#${i}`];
                          return (
                            <li key={i} className={on ? "on" : ""}>
                              <label>
                                <input
                                  type="checkbox"
                                  checked={on}
                                  onChange={() => toggleCheck(current.id, i)}
                                />
                                <span>{s}</span>
                              </label>
                            </li>
                          );
                        })}
                      </ol>
                    ) : (
                      <button
                        className="ai-btn"
                        onClick={askSteps}
                        disabled={stepsLoading}
                      >
                        {stepsLoading
                          ? "Quebrando…"
                          : "▸ Não sei começar — micropassos"}
                      </button>
                    )}
                  </div>
                )}

                {mounted && (
                  <div className="assist">
                    <div className="assist-label">Quando vou agir</div>
                    <input
                      className="plan-field"
                      placeholder="Se [horário/lugar], então executo isto…"
                      value={plans[current.id] ?? ""}
                      onChange={(e) => setPlan(current.id, e.target.value)}
                    />
                    <p className="plan-note">
                      <b>Se → Então:</b> amarrar a ação a um gatilho concreto
                      (quando e onde) multiplica a chance de você realmente agir.
                    </p>
                  </div>
                )}

                <div className="q-block">
                  <div className="q-label">Encare a raiz</div>
                  <p className="question">{current.question}</p>
                </div>

                <div className="anchor">
                  <span className="mark">&ldquo;</span>
                  <span className="txt">
                    {current.anchor.text}
                    <span className="src">— {current.anchor.source}</span>
                  </span>
                </div>

                {mounted && (
                  <div className="assist">
                    <div className="assist-label">Sua reflexão</div>
                    <textarea
                      className="reflect"
                      placeholder="Escreva o que essa pergunta move em você… (opcional)"
                      value={reflections[current.id] ?? ""}
                      onChange={(e) => setReflection(current.id, e.target.value)}
                    />
                    <button
                      className="ai-btn"
                      style={{ marginTop: 10 }}
                      onClick={askMentor}
                      disabled={mentorLoading}
                    >
                      {mentorLoading ? "Pensando…" : "✦ Aprofundar com o mentor"}
                    </button>
                    {mentorById[current.id]?.text && (
                      <div className="mentor">
                        <span className="mentor-label">Mentor</span>
                        <p>{mentorById[current.id]?.text}</p>
                      </div>
                    )}
                    {mentorById[current.id]?.error && (
                      <div className="mentor err">
                        <span className="mentor-label">Mentor</span>
                        <p>{mentorById[current.id]?.error}</p>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ) : (
              <article className="card">
                <p className="question">
                  Nenhum desafio com esses filtros. Ajuste abaixo.
                </p>
              </article>
            )}
          </div>

          {current && (
            <div className="actions">
              <button className="btn" onClick={next}>
                Outro
              </button>
              <button
                className={`btn btn-primary ${pulse ? "pulse" : ""}`}
                onClick={done}
              >
                ✓ Encarei
              </button>
              {celebrate > 0 && (
                <div className="strike" key={celebrate} aria-hidden="true">
                  <i className="shock" />
                  <span className="spark" />
                  <span className="spark" />
                  <span className="spark" />
                  <span className="spark" />
                </div>
              )}
            </div>
          )}

          <details className="panel">
            <summary>
              <span>
                Filtrar ·{" "}
                {catFilter === "todas"
                  ? "todas as áreas"
                  : CATEGORIES[catFilter].label}
                {intFilter !== "todas"
                  ? ` · ${INTENSITY[intFilter].label.toLowerCase()}`
                  : ""}
              </span>
              <span>⌄</span>
            </summary>
            <div className="body">
              <div className="q-label">Área</div>
              <div className="pillrow">
                <button
                  className={`pill ${catFilter === "todas" ? "on" : ""}`}
                  onClick={() => applyCat("todas")}
                >
                  Todas
                </button>
                {CATEGORY_ORDER.map((id) => (
                  <button
                    key={id}
                    className={`pill ${catFilter === id ? "on" : ""}`}
                    onClick={() => applyCat(id)}
                  >
                    {CATEGORIES[id].emoji} {CATEGORIES[id].label}
                  </button>
                ))}
              </div>

              <div className="q-label" style={{ marginTop: 16 }}>
                Intensidade
              </div>
              <div className="pillrow">
                <button
                  className={`pill ${intFilter === "todas" ? "on" : ""}`}
                  onClick={() => applyInt("todas")}
                >
                  Todas
                </button>
                {([1, 2, 3] as Intensity[]).map((i) => (
                  <button
                    key={i}
                    className={`pill ${intFilter === i ? "on" : ""}`}
                    onClick={() => applyInt(i)}
                  >
                    {INTENSITY[i].label}
                  </button>
                ))}
              </div>
            </div>
          </details>

          <p className="subtle">
            {deck.length} desafios nesta seleção
            {mounted && totalDone > 0
              ? ` · ${totalDone} encarados${doneToday > 0 ? ` · ${doneToday} hoje` : ""}`
              : ""}
          </p>
        </>
      )}

      {/* ---------------- IDIOMAS ---------------- */}
      {mode === "idiomas" && (
        <div className="lang">
          <div className="langbar">
            <button
              className={`pill ${lang === "en" ? "on" : ""}`}
              onClick={() => changeLang("en")}
            >
              🇬🇧 Inglês
            </button>
            <button
              className={`pill ${lang === "ru" ? "on" : ""}`}
              onClick={() => changeLang("ru")}
            >
              🇷🇺 Russo
            </button>
          </div>

          <div className="card">
            {THEMES.map((t) => (
              <section key={t.id}>
                <div className="theme-head">
                  {t.emoji} {t.label}
                </div>
                {t.phrases.map((p, i) => {
                  const target = targetOf(p, lang);
                  const pron = lang === "en" ? p.enPron : p.ruPron;
                  return (
                    <div className="phrase-line" key={`${t.id}-${i}`}>
                      <div className="phrase-main">
                        <div className="phrase-target">{target}</div>
                        <div className="phrase-pron">{pron}</div>
                        <div className="phrase-pt">{p.pt}</div>
                      </div>
                      <button
                        className="speak"
                        aria-label={`Ouvir em ${langName(lang)}`}
                        onClick={() => speak(target, langCode(lang))}
                      >
                        🔊
                      </button>
                    </div>
                  );
                })}
              </section>
            ))}
          </div>

          <p className="subtle">
            Toque em 🔊 para ouvir a pronúncia · {ALL_PHRASES.length} frases
          </p>
        </div>
      )}

      {/* ---------------- QUIZ ---------------- */}
      {mode === "quiz" && q && (
        <div className="lang">
          <div className="langbar">
            <button
              className={`pill ${lang === "en" ? "on" : ""}`}
              onClick={() => changeLang("en")}
            >
              🇬🇧 Inglês
            </button>
            <button
              className={`pill ${lang === "ru" ? "on" : ""}`}
              onClick={() => changeLang("ru")}
            >
              🇷🇺 Russo
            </button>
          </div>

          <div className="card enter" key={`${quizRound}-${quizIdx}`}>
            <div className="scorebar">
              <span>
                Pergunta {quizIdx + 1}/{quiz.length}
              </span>
              <span>✓ {score}</span>
            </div>
            <div className="progressbar">
              <i
                style={{
                  width: `${((quizIdx + (answered ? 1 : 0)) / quiz.length) * 100}%`,
                }}
              />
            </div>

            <div className="quiz-sub">Como se diz em {langName(lang)}?</div>
            <div className="quiz-q">{q.pt}</div>

            <div style={{ marginTop: 16 }}>
              {q.options.map((opt) => {
                const cls = answered
                  ? opt === q.correct
                    ? "correct"
                    : opt === answered
                      ? "wrong"
                      : "dim"
                  : "";
                return (
                  <button
                    key={opt}
                    className={`opt ${cls}`}
                    onClick={() => answer(opt)}
                    disabled={!!answered}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="actions">
                <button
                  className="btn"
                  onClick={() => speak(q.correct, langCode(lang))}
                >
                  🔊 Ouvir
                </button>
                <button className="btn btn-primary" onClick={nextQuiz}>
                  {quizIdx + 1 >= quiz.length ? "Recomeçar" : "Próxima →"}
                </button>
              </div>
            )}
          </div>

          <p className="subtle">
            Acertos nesta rodada: {score}/{quiz.length}
          </p>
        </div>
      )}

      {/* ---------------- CÉREBRO ---------------- */}
      {mode === "cerebro" && (
        <div className="lang brain">
          <div className="langbar">
            <button
              className={`pill ${brainGame === "schulte" ? "on" : ""}`}
              onClick={() => setBrainGame("schulte")}
            >
              🔢 Números
            </button>
            <button
              className={`pill ${brainGame === "stroop" ? "on" : ""}`}
              onClick={() => setBrainGame("stroop")}
            >
              🎨 Cores
            </button>
          </div>

          {brainGame === "schulte" ? (
            <>
              <div className="brain-stats">
                <span>
                  Recorde: <b>{brain.best !== null ? fmtMs(brain.best) : "—"}</b>
                </span>
                <span>
                  Sequência: <b>{brain.streak}</b>
                </span>
                <span>
                  Rodadas: <b>{brain.plays}</b>
                </span>
              </div>

              <div className="card">
                {grid.length === 0 ? (
                  <>
                    <div className="brain-hint">
                      Toque os números de 1 a 25 em ordem, o mais rápido que
                      conseguir.
                    </div>
                    <div className="actions">
                      <button className="btn btn-primary" onClick={startSchulte}>
                        Começar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="brain-timer">
                      {startedAt === null
                        ? "0.0s"
                        : fmtMs(finishedMs ?? Math.max(0, now - startedAt))}
                    </div>
                    {finishedMs !== null ? (
                      <div className="brain-hint">
                        {brain.best !== null && finishedMs <= brain.best
                          ? "Novo recorde! 🔥"
                          : "Feito. Amanhã, mais rápido."}
                      </div>
                    ) : (
                      <div className="brain-hint">Próximo: {nextNum}</div>
                    )}
                    <div className="schulte">
                      {grid.map((n) => {
                        const done = n < nextNum || finishedMs !== null;
                        const cls =
                          wrongCell === n ? "wrong" : done ? "done" : "";
                        return (
                          <button
                            key={n}
                            className={`sq ${cls}`}
                            onClick={() => tapCell(n)}
                            disabled={finishedMs !== null}
                          >
                            {n}
                          </button>
                        );
                      })}
                    </div>
                    {finishedMs !== null && (
                      <div className="actions">
                        <button
                          className="btn btn-primary"
                          onClick={startSchulte}
                        >
                          De novo
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <p className="brain-note">
                A Tabela de Schulte treina atenção focada, visão periférica e
                velocidade de processamento. Praticada todo dia, a queda no seu
                tempo é a neuroplasticidade em ação — o cérebro reforçando as
                conexões que você mais usa.
              </p>
            </>
          ) : (
            <>
              <div className="brain-stats">
                <span>
                  Recorde:{" "}
                  <b>
                    {stroopStats.best !== null ? fmtMs(stroopStats.best) : "—"}
                  </b>
                </span>
                <span>
                  Sequência: <b>{stroopStats.streak}</b>
                </span>
                <span>
                  Rodadas: <b>{stroopStats.plays}</b>
                </span>
              </div>

              <div className={`card ${stroopFlash ? "flash-err" : ""}`}>
                {!stroopTrial ? (
                  <>
                    <div className="brain-hint">
                      Toque na COR da tinta — não na palavra. 20 rodadas, o mais
                      rápido que puder.
                    </div>
                    <div className="actions">
                      <button className="btn btn-primary" onClick={startStroop}>
                        Começar
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="brain-timer">
                      {stroopStart === null
                        ? "0.0s"
                        : fmtMs(stroopMs ?? Math.max(0, now - stroopStart))}
                    </div>
                    {stroopMs !== null ? (
                      <div className="brain-hint">
                        {stroopStats.best !== null &&
                        stroopMs <= stroopStats.best
                          ? "Novo recorde! 🔥"
                          : "Feito. Amanhã, mais nítido."}
                      </div>
                    ) : (
                      <div className="brain-hint">
                        {stroopI}/{STROOP_TRIALS}
                      </div>
                    )}
                    {stroopMs === null && (
                      <>
                        <div
                          className="stroop-word"
                          style={{ color: COLORS[stroopTrial.inkIdx].hex }}
                        >
                          {COLORS[stroopTrial.wordIdx].name.toUpperCase()}
                        </div>
                        <div className="stroop-grid">
                          {stroopTrial.opts.map((i) => (
                            <button
                              key={i}
                              className="stroop-opt"
                              onClick={() => answerStroop(i)}
                            >
                              {COLORS[i].name}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                    {stroopMs !== null && (
                      <div className="actions">
                        <button
                          className="btn btn-primary"
                          onClick={startStroop}
                        >
                          De novo
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <p className="brain-note">
                O Teste de Stroop força o cérebro a inibir a leitura automática e
                escolher a cor real — treino direto do controle executivo
                (córtex pré-frontal). A prática diária fortalece foco e
                autocontrole.
              </p>
            </>
          )}
        </div>
      )}

      {/* ---------------- DECIDIR ---------------- */}
      {mode === "decidir" && (
        <div className="lang decide">
          <p className="decide-intro">
            Duas escolhas na sua frente? Escreva-as e olhe por ângulos que os
            bons decisores usam.
          </p>

          <div className="card">
            <div className="assist-label">Opção A</div>
            <input
              className="plan-field"
              placeholder="Ex.: aceitar o convite"
              value={decA}
              onChange={(e) => setDecA(e.target.value)}
            />
            <div className="assist-label" style={{ marginTop: 14 }}>
              Opção B
            </div>
            <input
              className="plan-field"
              placeholder="Ex.: recusar e seguir como está"
              value={decB}
              onChange={(e) => setDecB(e.target.value)}
            />

            <div className="assist">
              <div className="assist-label">Lentes de decisão</div>
              <ul className="lens">
                <li>
                  <b>10 / 10 / 10:</b> como você se sentirá sobre isto em 10
                  minutos, 10 meses e 10 anos?
                </li>
                <li>
                  <b>Conselho ao amigo:</b> se fosse seu melhor amigo nessa
                  situação, o que você diria?
                </li>
                <li>
                  <b>Arrependimento:</b> daqui a 10 anos, pesaria mais ter feito
                  ou não ter feito?
                </li>
                <li>
                  <b>Pré-morte:</b> imagine que deu errado — qual foi a causa
                  provável? Mitigue-a.
                </li>
                <li>
                  <b>Custo de não decidir:</b> o que continua acontecendo
                  enquanto você não escolhe?
                </li>
              </ul>
            </div>

            <div className="assist">
              <div className="assist-label">Ainda em dúvida?</div>
              <button
                className="ai-btn"
                onClick={flipCoin}
                disabled={coin === "flipping" || (!decA && !decB)}
              >
                🪙 Jogar a moeda
              </button>
              {coin === "flipping" && (
                <div className="coin-result">Girando…</div>
              )}
              {(coin === "A" || coin === "B") && (
                <div className="coin-result">
                  A moeda caiu em{" "}
                  <b>{coin === "A" ? decA || "Opção A" : decB || "Opção B"}</b>.
                  <span>
                    Enquanto ela girava, qual resultado você torceu para sair?
                    Essa é a sua resposta.
                  </span>
                </div>
              )}
            </div>

            <div className="assist">
              <div className="assist-label">Clareza do mentor</div>
              <button
                className="ai-btn"
                onClick={askDecision}
                disabled={decLoading || (!decA && !decB)}
              >
                {decLoading ? "Pensando…" : "✦ Pedir clareza ao mentor"}
              </button>
              {decMentor?.text && (
                <div className="mentor">
                  <span className="mentor-label">Mentor</span>
                  <p>{decMentor.text}</p>
                </div>
              )}
              {decMentor?.error && (
                <div className="mentor err">
                  <span className="mentor-label">Mentor</span>
                  <p>{decMentor.error}</p>
                </div>
              )}
            </div>
          </div>

          <p className="brain-note">
            A clareza não vem de pensar mais, e sim de olhar de ângulos
            diferentes. As lentes acima são atalhos que grandes decisores usam
            para escapar do próprio viés.
          </p>
        </div>
      )}
    </main>
  );
}
