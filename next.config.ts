import type { NextConfig } from "next";

// GITHUB_PAGES=true builds a static export served from /<repo>
// (e.g. https://geniussingare.github.io/Portfolio).
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? process.env.PAGES_BASE_PATH ?? "/Portfolio" : "";

const nextConfig: NextConfig = {
  ...(isPages && { output: "export", basePath, trailingSlash: true }),
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    // The chat needs the /api/chat server route, which static hosting can't run.
    NEXT_PUBLIC_CHAT_ENABLED: isPages ? "false" : "true",
  },
};

export default nextConfig;
