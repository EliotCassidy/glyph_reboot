import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import { StrictMode } from "react";
import ReactDOM from "react-dom";

import "./i18n";
import App from "./App";
import "./index.css";
import "./fonts/Afaka-Roman.woff";
import "./fonts/Afaka-Roman.woff2";

Sentry.init({
  dsn: "https://b4db4287dd3d43f591289156c733e36a@o490182.ingest.sentry.io/5953019",
  integrations: [new Integrations.BrowserTracing()],
  environment: process.env.NODE_ENV,
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  beforeSend(event) {
    // Modify the event here
    if (process.env.NODE_ENV !== "production") {
      return null;
    }
    return event;
  },
});

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root"),
);
