/** @type {import('next').NextConfig} */
const {i18n} = require('./next-i18next.config')

const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"],
      },
    i18n: {
  locales: ['en', 'fr','ar'],
  defaultLocale: 'en',
  localeDetection: false, // Disable automatic redirect
}
};

module.exports = nextConfig;
