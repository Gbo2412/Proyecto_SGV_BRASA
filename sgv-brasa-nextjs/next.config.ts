import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ Peligroso: permite que el build continúe aunque haya errores de TypeScript
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
