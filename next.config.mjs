/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "avatars.githubusercontent.com",
      "opengraph.githubassets.com",
      "github.com", // in case you ever use github.com directly
    ],
  },
};

module.exports = nextConfig;
