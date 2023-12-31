/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'lh3.googleusercontent.com',
      'github.com',
      'avatars.githubusercontent.com',
      'images.unsplash.com']
  }
}

module.exports = nextConfig
