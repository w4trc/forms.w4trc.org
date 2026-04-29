Sentry.init({
  dsn: "https://d3378c1535a247199b9caa050f3d7852@glitchtip.jclab.xyz/1",
  tracesSampleRate: 0.75,
  autoSessionTracking: false,
  integrations: [Sentry.captureConsoleIntegration({ levels: ["error", "warn"] })],
});
