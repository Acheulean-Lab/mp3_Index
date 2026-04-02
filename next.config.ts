import type { NextConfig } from "next";

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' https://plausible.io;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https://images.unsplash.com;
  font-src 'self';
  object-src 'none';
  media-src 'self' blob:;
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
