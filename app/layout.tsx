import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://metanoia-pi.vercel.app"),
  title: "METANOIA — encare, aja, transforme",
  description:
    "Um desafio de coragem por vez: uma ação concreta para hoje e uma pergunta que vai à raiz. Ancorado na Palavra, no estoicismo e nos mestres. Funciona offline.",
  applicationName: "METANOIA",
  appleWebApp: { capable: true, title: "METANOIA", statusBarStyle: "black-translucent" },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#07070c",
  colorScheme: "dark light",
};

// Aplica o tema salvo antes da pintura, evitando flash de cor errada.
const themeScript = `try{if(localStorage.getItem('metanoia:theme')==='light'){document.documentElement.setAttribute('data-theme','light')}}catch(e){}`;

// Registra o service worker (offline + carregamento instantâneo).
const swScript = `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){})})}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className="h-full antialiased" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: swScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <div className="aurora" aria-hidden="true">
          <div className="veil" />
        </div>
        <div className="grain" aria-hidden="true" />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
