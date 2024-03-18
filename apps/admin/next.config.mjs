/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (webpackConfig) => {
    webpackConfig.resolve.fallback = { fs: false, path: false };
    return webpackConfig
  },
}

export default nextConfig
