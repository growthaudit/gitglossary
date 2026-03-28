import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "gitglossary — AI Git Commit Message Generator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#0a0a0a",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          padding: "80px",
          fontFamily: "monospace",
        }}
      >
        {/* Subtle grid lines */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Amber accent line */}
        <div
          style={{
            width: 48,
            height: 4,
            background: "#f59e0b",
            borderRadius: 2,
            marginBottom: 32,
          }}
        />

        {/* Logo line */}
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 24 }}>
          <span style={{ color: "#f59e0b", fontSize: 28, fontWeight: 700, letterSpacing: "-0.02em" }}>
            git
          </span>
          <span style={{ color: "#f5f5f5", fontSize: 36, fontWeight: 600 }}>
            glossary
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            color: "#f5f5f5",
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            maxWidth: 800,
            marginBottom: 24,
          }}
        >
          Perfect commit messages,{" "}
          <span style={{ color: "#f59e0b" }}>every time.</span>
        </div>

        {/* Sub */}
        <div style={{ color: "#888888", fontSize: 24, maxWidth: 600, lineHeight: 1.4 }}>
          AI-powered generator for Conventional Commits, Angular style, emoji prefix, and your team&apos;s custom standard.
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 80,
            color: "#555555",
            fontSize: 18,
            fontFamily: "monospace",
          }}
        >
          gitglossary.com
        </div>
      </div>
    ),
    { ...size }
  );
}
