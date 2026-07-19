"use client";

import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";

// beforeinstallprompt não está no lib.dom padrão — tipagem mínima.
interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallButton() {
  const [deferred, setDeferred] = useState<InstallPromptEvent | null>(null);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    function onPrompt(e: Event) {
      e.preventDefault();
      setDeferred(e as InstallPromptEvent);
    }
    function onInstalled() {
      track("instalado");
      setGone(true);
      setDeferred(null);
    }
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (gone || !deferred) return null;

  async function install() {
    const e = deferred;
    if (!e) return;
    setGone(true);
    await e.prompt();
    try {
      await e.userChoice;
    } catch {
      /* ignora */
    }
    setDeferred(null);
  }

  return (
    <button
      className="install-btn"
      onClick={install}
      aria-label="Instalar o app METANOIA"
    >
      <span aria-hidden="true">⬇</span> Instalar
    </button>
  );
}
