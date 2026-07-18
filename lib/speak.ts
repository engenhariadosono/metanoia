"use client";

// Pronúncia via voz do navegador (Web Speech API) — grátis, sem API.
// Usada na seção Idiomas pra ouvir inglês (en-US) e russo (ru-RU).

export function speechSupported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function speak(text: string, lang: string) {
  if (!speechSupported()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = lang;
  const prefix = lang.slice(0, 2).toLowerCase();
  const voice = window.speechSynthesis
    .getVoices()
    .find((v) => (v.lang || "").toLowerCase().startsWith(prefix));
  if (voice) u.voice = voice;
  u.rate = 0.9;
  window.speechSynthesis.speak(u);
}

// Prime a lista de vozes (algumas carregam de forma assíncrona).
export function warmVoices() {
  if (speechSupported()) window.speechSynthesis.getVoices();
}
