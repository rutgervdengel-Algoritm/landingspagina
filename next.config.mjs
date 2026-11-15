/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Opvang en BSO delen de startpagina; zwemles en sport staan apart.
      { source: '/kinderopvang', destination: '/', permanent: false },
      { source: '/kinderopvang/zakelijk', destination: '/', permanent: false },
      { source: '/bso', destination: '/', permanent: false },
      { source: '/zwemles', destination: '/branches/zwemles', permanent: false },
      { source: '/sport', destination: '/branches/sport', permanent: false },
    ];
  },
};

export default nextConfig;
