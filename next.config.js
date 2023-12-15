/** @type {import('next').NextConfig} */
const path = require("path");

const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  env: {
    SERVER_URI: process.env.NODE_ENV === "production" ? "http://localhost:8000" : "http://localhost:8000",
  },
  webpack: (config) => {
    config.experiments = { ...config.experiments, topLevelAwait: true };
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
    });
    return config;
  },
};

module.exports = nextConfig;
