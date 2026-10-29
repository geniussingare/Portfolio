import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Background from "@/components/Background";
import CursorGlow from "@/components/CursorGlow";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
});

export const metadata: Metadata = {
  title: "Ganesh Singare — Backend Engineer",
  description:
    "Backend Engineer with 3+ years building scalable Java, Spring Boot and microservice systems, REST APIs, and AI/RAG integrations.",
  keywords: [
    "Ganesh Singare",
    "Backend Engineer",
    "Java",
    "Spring Boot",
    "Microservices",
    "REST APIs",
    "RAG",
    "Portfolio",
  ],
  authors: [{ name: "Ganesh Singare" }],
  openGraph: {
    title: "Ganesh Singare — Backend Engineer",
    description:
      "Scalable Java systems, microservices, and AI-integrated backends.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#05060f",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${grotesk.variable} ${jetbrains.variable}`}
    >
      <body>
        <Background />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
