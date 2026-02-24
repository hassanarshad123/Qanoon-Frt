"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div style={{
          display: "flex",
          minHeight: "100vh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          padding: "1rem",
          textAlign: "center",
          fontFamily: "system-ui, sans-serif",
        }}>
          <div style={{
            borderRadius: "9999px",
            backgroundColor: "#FEE2E2",
            padding: "1rem",
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <div>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>
              Something went wrong
            </h2>
            <p style={{ color: "#6B7280", maxWidth: "28rem", marginTop: "0.5rem" }}>
              A critical error occurred. Please try again or contact support.
            </p>
          </div>
          <button
            onClick={reset}
            style={{
              padding: "0.5rem 1rem",
              border: "1px solid #D1D5DB",
              borderRadius: "0.375rem",
              cursor: "pointer",
              backgroundColor: "white",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
