import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Transpile packages from source during development for hot reloading
  // This allows Next.js to handle TypeScript/JSX in the monorepo packages
  transpilePackages: [
    "@catalyst/core",
    "@catalyst/react",
    "@catalyst/demo-components",
    "@catalyst/storage",
  ],
};

export default nextConfig;
