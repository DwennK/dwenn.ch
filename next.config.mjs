/* Array of authorized domains for remote images */
const hostnames = ["github.com", "lh3.googleusercontent.com"];

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* Nous sert à définir les hostname authorisés pour les images */
  images: {
    remotePatterns: hostnames.map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
};

export default nextConfig;
