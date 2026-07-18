"use client";

import { useCallback, useState } from "react";

export interface Progress {
  totalDone: number;
  streak: number;
  lastDoneDate: string | null; // YYYY-MM-DD
  doneToday: number;
  doneIds: string[]; // já encarados (histórico simples)
}

const KEY = "metanoia:progress";

function today(): string {
  return new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD estável
}

function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString("en-CA");
}

function defaults(): Progress {
  return {
    totalDone: 0,
    streak: 0,
    lastDoneDate: null,
    doneToday: 0,
    doneIds: [],
  };
}

function load(): Progress {
  if (typeof window === "undefined") return defaults();
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return defaults();
    return { ...defaults(), ...(JSON.parse(raw) as Progress) };
  } catch {
    return defaults();
  }
}

function save(p: Progress) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function useProgress() {
  const [state, setState] = useState<Progress>(load);

  const markDone = useCallback((id: string) => {
    setState((prev) => {
      const t = today();
      let streak = prev.streak;
      let doneToday = prev.doneToday;
      if (prev.lastDoneDate === t) {
        doneToday += 1;
      } else if (prev.lastDoneDate === yesterday()) {
        streak += 1;
        doneToday = 1;
      } else {
        streak = 1;
        doneToday = 1;
      }
      const next: Progress = {
        totalDone: prev.totalDone + 1,
        streak,
        lastDoneDate: t,
        doneToday,
        doneIds: [id, ...prev.doneIds.filter((x) => x !== id)].slice(0, 200),
      };
      save(next);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    const d = defaults();
    save(d);
    setState(d);
  }, []);

  // A "chama" quebra se o último dia encarado não foi hoje nem ontem.
  const streakAlive =
    state.lastDoneDate === today() || state.lastDoneDate === yesterday();

  return {
    ...state,
    streak: streakAlive ? state.streak : 0,
    markDone,
    reset,
  };
}
