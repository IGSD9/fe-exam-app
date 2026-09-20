import type { NextConfig } from "next";

const root = process.cwd();

const nextConfig: NextConfig = {
  agentRules: false,
  turbopack: {
    root,
    resolveAlias: {
      "@": root,
    },
  },
};

export default nextConfig;
