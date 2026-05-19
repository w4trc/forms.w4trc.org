Sentry.init({
  dsn: "https://c4a228f4fe9eb9f2ad298a79dc18cfb8@o4509799469547520.ingest.us.sentry.io/4511417569312768",
  tracesSampleRate: 0.75,
  autoSessionTracking: false,
  integrations: [Sentry.captureConsoleIntegration({ levels: ["error", "warn", "log", "info"] })],
});
