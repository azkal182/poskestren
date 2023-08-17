/** @type {import('next').NextConfig} */
const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public",
  register: false,
    skipWaiting: false,
    disable: process.env.NODE_ENV === "development",
  
});

module.exports = withPWA({
  // Your Next.js config
});