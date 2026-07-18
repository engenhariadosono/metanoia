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

type Mode = "encarar" | "idiomas" | "quiz";
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

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("encarar");
  const [theme, setTheme] = useState<"dark" | "light">(initialTheme);

  // ---- Encarar ----
  const [catFilter, setCatFilter] = useState<CatFilter>("todas");
  const [intFilter, setIntFilter] = useState<IntFilter>("todas");
  const [currentId, setCurrentId] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);

  // ---- Idiomas / Quiz ----
  const [lang, setLang] = useState<Lang>("en");
  const [quizRound, setQuizRound] = useState(0);
  const [quizIdx, setQuizIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState<string | null>(null);

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
    </main>
  );
}
