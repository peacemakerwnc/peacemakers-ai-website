import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Local acceptance / Playwright may use 127.0.0.1 while Next defaults to localhost.
  allowedDevOrigins: ["127.0.0.1", "localhost"],
};

export default nextConfig;
