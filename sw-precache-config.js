module.exports = {
    root: "dist/project-pwa",
    stripPrefix: "dist/project-pwa",
    navigateFallback: "/index.html",
    importScripts: ["firebase-messaging-sw.js"]
  };