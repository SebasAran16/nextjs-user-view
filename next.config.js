/** @type {import('next').NextConfig} */

const withNextIntl = require("next-intl/plugin")();
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d2aeqc935ryq52.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = withNextIntl(nextConfig);
