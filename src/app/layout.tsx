import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "GAIA — Go Autonomous Intelligence Agent",
  description:
    "Programming-first autonomous agent written in Go. Single binary, zero external dependencies, multi-agent specialized learning with 12+ subagents, SDD workflow, and persistent memory.",
  openGraph: {
    title: "GAIA — Go Autonomous Intelligence Agent",
    description:
      "Programming-first autonomous agent written in Go. 12+ specialized subagents, Mixture of Agents, Spec-Driven Development, and Knowledge Graph.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${outfit.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg-dark text-text-primary">
        {children}
      </body>
    </html>
  );
}
