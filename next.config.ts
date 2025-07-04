import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config) => {
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferUtil: "commonjs bufferutil"
    })

    return config;
  },
  images: {
    domains: [
      "utfs.io",
      "nwwuqzz87e.ufs.sh"
    ]
  }
};

export default nextConfig;
