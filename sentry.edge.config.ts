import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,

  enabled: !!process.env.SENTRY_DSN,

  environment: process.env.SENTRY_ENVIRONMENT || "development",

  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
});
