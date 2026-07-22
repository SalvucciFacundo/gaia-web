"use client";

import { useState, useEffect } from "react";

/* ─── Subagent Data ─── */
const SUBAGENTS = [
  { name: "Explorer", type: "SDD", role: "Investiga codebase, patrones, arquitectura", emoji: "🔍" },
  { name: "Proposer", type: "SDD", role: "Crea propuestas de cambio con alcance y riesgos", emoji: "💡" },
  { name: "Specifier", type: "SDD", role: "Escribe specs detallados con escenarios", emoji: "📋" },
  { name: "Designer", type: "SDD", role: "Arquitectura técnica y diseño de componentes", emoji: "🏗️" },
  { name: "Planner", type: "SDD", role: "Divide specs en tareas concretas", emoji: "📐" },
  { name: "Implementer", type: "SDD", role: "Escribe código siguiendo specs y tareas", emoji: "⚡" },
  { name: "Verifier", type: "SDD", role: "Ejecuta tests y valida contra spec", emoji: "✅" },
  { name: "Reviewer", type: "BR", role: "Code review: riesgo, resiliencia, legibilidad", emoji: "👁️" },
  { name: "Learner", type: "BG", role: "Analiza uso, crea/mejora skills", emoji: "🧠" },
  { name: "Researcher", type: "OD", role: "Web research y descubrimiento de APIs", emoji: "📚" },
  { name: "Archiver", type: "SDD", role: "Cierra cambios completados y persiste estado", emoji: "📦" },
  { name: "Debugger", type: "OD", role: "Análisis de bugs, causa raíz, fix", emoji: "🐛" },
];

/* ─── Features Data ─── */
const FEATURES = [
  {
    title: "12+ Subagentes Especializados",
    desc: "Cada subagente aprende independientemente en su dominio. El Designer no empeora porque el Implementer tuvo un mal día.",
    icon: (
      <svg className="w-8 h-8 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    glow: "glow-cyan",
  },
  {
    title: "Mixture of Agents (MoA)",
    desc: "Ejecuta múltiples LLMs en paralelo sobre la misma tarea. Recolecta todas las respuestas y las sintetiza en un resultado coherente.",
    icon: (
      <svg className="w-8 h-8 text-neon-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
      </svg>
    ),
    glow: "glow-emerald",
  },
  {
    title: "Spec-Driven Development",
    desc: "Pipeline nativo de 8 fases: explorar → proponer → spec → diseñar → tareas → implementar → verificar → archivar.",
    icon: (
      <svg className="w-8 h-8 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
    glow: "glow-purple",
  },
  {
    title: "BR Code Review",
    desc: "4 lentes acotados + recibos con hash SHA256. Pre-commit y pre-push validan contra el mismo recibo — sin re-reviews silenciosas.",
    icon: (
      <svg className="w-8 h-8 text-neon-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 3.75H6m2.25-2.25H7.5m4.125 0H12m-3.75 7.5h11.25M12 3.75v16.5M5.625 3.75h12.75a1.875 1.875 0 011.875 1.875v16.5a1.875 1.875 0 01-1.875 1.875H5.625a1.875 1.875 0 01-1.875-1.875V5.625c0-1.036.84-1.875 1.875-1.875z" />
      </svg>
    ),
    glow: "glow-cyan",
  },
  {
    title: "Knowledge Graph",
    desc: "Aprendizaje en 3 niveles: ámbito de usuario, lenguaje y proyecto. Auto-detección de lenguaje desde go.mod, package.json y más.",
    icon: (
      <svg className="w-8 h-8 text-neon-emerald" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
      </svg>
    ),
    glow: "glow-emerald",
  },
  {
    title: "Multi-Platform Gateway",
    desc: "Conectá GAIA a Telegram, Discord, Slack, WhatsApp y Signal. Un solo binario, cero dependencias externas.",
    icon: (
      <svg className="w-8 h-8 text-neon-purple" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
    glow: "glow-purple",
  },
];

/* ─── Stats Data ─── */
const STATS = [
  { label: "Subagentes", value: "12+" },
  { label: "Paquetes Go", value: "31" },
  { label: "Comandos CLI", value: "30+" },
  { label: "Lentes Review", value: "4" },
  { label: "Plataformas Gateway", value: "5" },
  { label: "Providers LLM", value: "4+" },
];

/* ─── Componentes ─── */

function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "glass-card border-b border-border-subtle"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2">
          <span className="text-xl font-extrabold tracking-tight text-gradient">
            GAIA
          </span>
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
          <a href="#features" className="hover:text-neon-cyan transition-colors">
            Features
          </a>
          <a href="#subagents" className="hover:text-neon-cyan transition-colors">
            Subagents
          </a>
          <a href="#quickstart" className="hover:text-neon-cyan transition-colors">
            Quick Start
          </a>
          <a
            href="https://github.com/SalvucciFacundo/gaia"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg glass-card border border-border-neon-cyan hover:glow-cyan transition-all duration-300 text-text-primary"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-grid">
      {/* Ambient glows */}
      <div className="bg-glow-orb bg-neon-cyan top-[-10%] left-[-5%] animate-pulse-glow" />
      <div
        className="bg-glow-orb bg-neon-emerald bottom-[-10%] right-[-5%]"
        style={{ animation: "pulse-glow 5s ease-in-out infinite 1s" }}
      />
      <div className="bg-glow-orb bg-neon-purple top-[40%] right-[30%] opacity-10" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card border border-border-neon-cyan/30 text-neon-cyan text-xs font-mono mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
          v2.0 · Go 1.22+ · MIT License
        </div>

        {/* Title */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 leading-tight">
          <span className="text-gradient">GAIA</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto mb-4 leading-relaxed">
          <span className="text-text-primary font-semibold">Go Autonomous Intelligence Agent</span>
          — Un agente autónomo{" "}
          <span className="text-neon-cyan">programming-first</span> escrito en Go.
          Binario único, cero dependencias externas.
        </p>

        {/* Subtitle */}
        <p className="text-base text-text-muted max-w-2xl mx-auto mb-10">
          12 subagentes especializados · Mixture of Agents · Spec-Driven Development ·
          Knowledge Graph · BR Code Review · Multi-Platform Gateway
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#quickstart"
            className="px-8 py-3.5 rounded-xl font-semibold text-sm bg-neon-cyan/10 border border-neon-cyan text-neon-cyan hover:glow-cyan hover:bg-neon-cyan/20 transition-all duration-300"
          >
            🚀 Quick Start
          </a>
          <a
            href="https://github.com/SalvucciFacundo/gaia"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3.5 rounded-xl font-semibold text-sm glass-card border border-border-subtle text-text-primary hover:border-text-muted transition-all duration-300"
          >
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              View on GitHub
            </span>
          </a>
        </div>

        {/* Terminal Preview */}
        <div className="mt-16 max-w-2xl mx-auto glass-card rounded-2xl p-1 border-border-subtle text-left">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border-subtle">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="text-xs text-text-muted ml-2 font-mono">terminal</span>
          </div>
          <div className="p-4 font-mono text-sm leading-relaxed">
            <span className="text-text-muted"># Install GAIA</span>
            <br />
            <span className="text-neon-emerald">$</span>{" "}
            <span className="text-text-primary">git clone https://github.com/SalvucciFacundo/gaia.git</span>
            <br />
            <span className="text-neon-emerald">$</span>{" "}
            <span className="text-text-primary">cd gaia && go build -o gaia ./cmd/gaia/</span>
            <br />
            <span className="text-neon-emerald">$</span>{" "}
            <span className="text-text-primary">./gaia</span>
            <br />
            <span className="text-text-muted"># &gt; @explorer investigate this codebase</span>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="mt-16 flex flex-col items-center gap-2 text-text-muted animate-float">
          <span className="text-xs font-mono">scroll</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      {/* Ambient glow */}
      <div className="bg-glow-orb bg-neon-cyan top-0 left-[50%] translate-x-[-50%] opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Everything You Need,{" "}
            <span className="text-gradient">Nothing You Don&apos;t</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            GAIA combina lo mejor de Hermes Agent, Gentle-AI, ogcode y pi-go en un solo
            binario Go. Sin Python, sin Node.js, sin ffmpeg.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div
              key={i}
              className={`group glass-card rounded-2xl p-8 border-border-subtle hover:${feature.glow} transition-all duration-500 cursor-default`}
              style={{
                animation: `fade-in-up 0.6s ease-out ${i * 0.1}s forwards`,
                opacity: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = i % 2 === 0 ? "rgba(0, 240, 255, 0.25)" : "rgba(0, 255, 157, 0.25)";
                e.currentTarget.style.background = "rgba(26, 35, 56, 0.85)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.background = "rgba(18, 24, 38, 0.65)";
              }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">{feature.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Subagents() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section id="subagents" className="relative py-32 px-6">
      <div className="bg-glow-orb bg-neon-purple top-0 right-0 opacity-10" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gradient-emerald">12+</span> Subagentes Autónomos
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Cada subagente tiene su propio contexto aislado, namespace de memoria,
            loop de aprendizaje independiente y modelo LLN configurable.
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-hidden rounded-2xl border border-border-subtle">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border-subtle bg-bg-surface">
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Subagent</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-text-muted uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody>
              {SUBAGENTS.map((s, i) => (
                <tr
                  key={i}
                  className="border-b border-border-subtle/50 transition-all duration-200"
                  style={{ background: hoveredIndex === i ? "rgba(26, 35, 56, 0.5)" : "transparent" }}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{s.emoji}</span>
                      <span className="font-semibold text-text-primary">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-0.5 rounded-md text-xs font-mono font-semibold ${
                        s.type === "SDD"
                          ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                          : s.type === "BR"
                          ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                          : s.type === "BG"
                          ? "bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20"
                          : "bg-text-muted/10 text-text-muted border border-text-muted/20"
                      }`}
                    >
                      {s.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-secondary">{s.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden grid gap-4">
          {SUBAGENTS.map((s, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-5 border-border-subtle transition-all duration-300"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(0, 240, 255, 0.25)";
                e.currentTarget.style.background = "rgba(26, 35, 56, 0.85)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.background = "rgba(18, 24, 38, 0.65)";
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{s.emoji}</span>
                  <span className="font-semibold text-text-primary">{s.name}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                    s.type === "SDD"
                      ? "bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20"
                      : s.type === "BR"
                      ? "bg-neon-purple/10 text-neon-purple border border-neon-purple/20"
                      : s.type === "BG"
                      ? "bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20"
                      : "bg-text-muted/10 text-text-muted border border-text-muted/20"
                  }`}
                >
                  {s.type}
                </span>
              </div>
              <p className="text-sm text-text-secondary">{s.role}</p>
            </div>
          ))}
        </div>

        {/* Type Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-xs text-text-muted font-mono">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-cyan" /> SDD — Spec-Driven Development
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-purple" /> BR — Bounded Review
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-neon-emerald" /> BG — Background
          </span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-text-muted" /> OD — On-Demand
          </span>
        </div>
      </div>
    </section>
  );
}

function Architecture() {
  return (
    <section id="architecture" className="relative py-32 px-6">
      <div className="bg-glow-orb bg-neon-emerald bottom-0 left-0 opacity-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="text-gradient-cyan">Hexagonal</span> Architecture
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Puertos y adaptadores. 31 paquetes Go. Un solo binario.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-16">
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="glass-card rounded-xl p-5 text-center border-border-subtle hover:border-border-neon-cyan/30 transition-all duration-300"
            >
              <div className="text-2xl font-extrabold text-gradient mb-1">{stat.value}</div>
              <div className="text-xs text-text-muted font-mono">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Architecture Diagram */}
        <div className="glass-card rounded-2xl p-8 border-border-subtle overflow-hidden">
          <pre className="font-mono text-xs leading-relaxed text-text-secondary overflow-x-auto">
{`┌──────────────────────────────────────────────────────────┐
│                     GAIA (single binary)                    │
│                                                            │
│  ┌─────────────────────────────────────────────────┐      │
│  │  ORCHESTRATOR — Main Agent Loop                 │      │
│  │  • Think → Act → Learn → Persist                │      │
│  │  • Delegates to specialized subagents           │      │
│  │  • Synthesizes results, never does the work     │      │
│  │  • Progressive skill index (~3k tokens)         │      │
│  │  • Knowledge graph recall per turn              │      │
│  └─────────────────────────────────────────────────┘      │
│                           │                                │
│  ┌────────────────────────┼────────────────────────┐      │
│  │  SUBAGENT SYSTEM       │  Autonomous & Specialized│      │
│  │                        │                         │      │
│  │  ┌─────────┐┌────────┐┌────────┐┌──────────┐   │      │
│  │  │Explorer ││Proposer││Specifier││ Designer  │   │      │
│  │  └─────────┘└────────┘└────────┘└──────────┘   │      │
│  │  ┌─────────┐┌────────┐┌────────┐┌──────────┐   │      │
│  │  │ Planner ││Implement││Verifier││ Reviewer  │   │      │
│  │  └─────────┘└────────┘└────────┘└──────────┘   │      │
│  │  ┌─────────┐┌────────┐┌────────┐┌──────────┐   │      │
│  │  │ Learner ││Research││Archiver││ Debugger  │   │      │
│  │  └─────────┘└────────┘└────────┘└──────────┘   │      │
│  └─────────────────────────────────────────────────┘      │
│                           │                                │
│  ┌─────────────────────────────────────────────────┐      │
│  │  INFRASTRUCTURE                                  │      │
│  │  ┌────────┐┌──────────┐┌──────┐┌───────────┐   │      │
│  │  │LLM     ││Tool Exec ││Memory││Knowledge   │   │      │
│  │  │Provider││Engine    ││Engram││Graph Recall│   │      │
│  │  └────────┘└──────────┘└──────┘└───────────┘   │      │
│  │  ┌────────┐┌──────────┐┌──────┐┌───────────┐   │      │
│  │  │TUI     ││Desktop   ││MCP   ││Skills     │   │      │
│  │  │BubbleTea││Wails     ││Client││Loader     │   │      │
│  │  └────────┘└──────────┘└──────┘└───────────┘   │      │
│  └─────────────────────────────────────────────────┘      │
└──────────────────────────────────────────────────────────┘`}
          </pre>
        </div>
      </div>
    </section>
  );
}

function QuickStart() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const codeBlocks = [
    { label: "macOS / Linux", code: "git clone https://github.com/SalvucciFacundo/gaia.git\ncd gaia\ngo build -o gaia ./cmd/gaia/\n./gaia" },
    { label: "Windows (PowerShell)", code: ".\\install.ps1" },
    { label: "Docker Backend", code: "gaia exec \"explain this project\" --backend docker" },
    { label: "SSH Backend", code: "gaia exec \"list files\" --backend ssh://user@server" },
  ];

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      // fallback
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <section id="quickstart" className="relative py-32 px-6">
      <div className="bg-glow-orb bg-neon-cyan bottom-0 right-0 opacity-10" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            Get Started in{" "}
            <span className="text-gradient-emerald">Seconds</span>
          </h2>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Un solo comando y ya estás corriendo. Sin Python, sin Node.js, sin ffmpeg.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {codeBlocks.map((block, i) => (
            <div
              key={i}
              className="glass-card rounded-2xl border-border-subtle overflow-hidden group hover:border-border-neon-emerald/30 transition-all duration-300"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-3 border-b border-border-subtle">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-neon-emerald/60" />
                  <span className="text-xs font-mono text-text-muted">{block.label}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(block.code, i)}
                  className="text-xs font-mono text-text-muted hover:text-neon-cyan transition-colors"
                >
                  {copiedIndex === i ? "copied!" : "copy"}
                </button>
              </div>

              {/* Code */}
              <pre className="p-5 font-mono text-sm leading-relaxed overflow-x-auto">
                <code className="text-text-secondary">
                  {block.code.split("\n").map((line, j) => (
                    <div key={j}>
                      {line.startsWith("$") ? (
                        <>
                          <span className="text-neon-emerald">$</span>{" "}
                          <span className="text-text-primary">{line.slice(2)}</span>
                        </>
                      ) : line.startsWith("#") ? (
                        <span className="text-text-muted italic">{line}</span>
                      ) : (
                        <span className="text-text-primary">{line}</span>
                      )}
                    </div>
                  ))}
                </code>
              </pre>
            </div>
          ))}
        </div>

        {/* First Run */}
        <div className="mt-8 glass-card rounded-2xl p-6 border-border-subtle">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center flex-shrink-0 text-neon-cyan font-bold text-lg">
              1
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-1">First Run</h4>
              <p className="text-sm text-text-secondary mb-3">
                En el primer inicio, GAIA abre un asistente de configuración para
                configurar tu proveedor LLM e instalar las skills recomendadas.
              </p>
              <div className="glass-card rounded-xl p-4 border-border-subtle font-mono text-sm">
                <span className="text-neon-emerald">$</span>{" "}
                <span className="text-text-primary">gaia</span>
                <br />
                <span className="text-text-muted italic"># Setup wizard starts automatically</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border-subtle py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <span className="text-xl font-extrabold tracking-tight text-gradient">GAIA</span>
            <p className="text-sm text-text-muted mt-3 leading-relaxed">
              Go Autonomous Intelligence Agent.
              <br />
              Programming-first. Single binary. Zero deps.
            </p>
          </div>

          {/* Docs Links */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Documentation</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              {["CLI Commands", "SDD Workflow", "Architecture", "Subagent System", "Configuration"].map((doc) => (
                <li key={doc}>
                  <a href="#" className="hover:text-neon-cyan transition-colors">
                    {doc}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Community */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">Community</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="https://github.com/SalvucciFacundo/gaia" target="_blank" rel="noopener noreferrer" className="hover:text-neon-cyan transition-colors">
                  GitHub
                </a>
              </li>
              <li>
                <a href="https://github.com/SalvucciFacundo/gaia/issues" target="_blank" rel="noopener noreferrer" className="hover:text-neon-cyan transition-colors">
                  Issues
                </a>
              </li>
              <li>
                <a href="https://github.com/SalvucciFacundo/gaia/releases" target="_blank" rel="noopener noreferrer" className="hover:text-neon-cyan transition-colors">
                  Releases
                </a>
              </li>
            </ul>
          </div>

          {/* License */}
          <div>
            <h4 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">License</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li>
                <a href="#" className="hover:text-neon-cyan transition-colors">
                  MIT License
                </a>
              </li>
              <li>
                <span className="text-text-muted">
                  Built with Go. Inspired by Hermes Agent, Gentle-AI, ogcode, and pi-go.
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border-subtle flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} GAIA. MIT License.
          </p>
          <p className="text-xs text-text-muted">
            Built by{" "}
            <a
              href="https://github.com/SalvucciFacundo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon-cyan hover:glow-cyan transition-all duration-300"
            >
              Facundo Salvucci
            </a>
          </p>
          <p className="text-xs text-text-muted font-mono">
            gaia v2.0 · go 1.22+ · single binary
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ─── Page ─── */
export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Features />
        <Subagents />
        <Architecture />
        <QuickStart />
      </main>
      <Footer />
    </>
  );
}
