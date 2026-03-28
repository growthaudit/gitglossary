import type { Metadata } from "next";
import { JetBrains_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gitglossary.com"),
  title: {
    default: "gitglossary — AI Git Commit Message Generator",
    template: "%s | gitglossary",
  },
  description:
    "Generate perfect git commit messages from your diff. Supports Conventional Commits, Angular style, emoji prefix, Jira-linked, and custom team standards. Free AI-powered tool.",
  keywords: [
    "git commit message generator",
    "conventional commits",
    "git commit format",
    "commit message AI",
    "git best practices",
  ],
  openGraph: {
    type: "website",
    siteName: "gitglossary",
    title: "gitglossary — AI Git Commit Message Generator",
    description:
      "Generate perfect git commit messages from your diff. Supports Conventional Commits, Angular style, emoji prefix, and custom team standards.",
    url: "https://gitglossary.com",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "gitglossary — AI Git Commit Message Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "gitglossary — AI Git Commit Message Generator",
    description: "Generate perfect git commit messages from your diff in seconds.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "gitglossary",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  description:
    "AI-powered git commit message generator. Supports Conventional Commits, Angular style, emoji prefix, Jira-linked, and custom team standards.",
  url: "https://gitglossary.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jetbrainsMono.variable} ${fraunces.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
