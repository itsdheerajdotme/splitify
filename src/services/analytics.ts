import siteConfig from "../config/site.json";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
  }
}

/**
 * Dynamically initializes Google Analytics (gtag.js) if a Measurement ID is configured in site.json.
 */
export function initAnalytics(measurementIdOverride?: string): void {
  const measurementId =
    measurementIdOverride ||
    siteConfig.analytics?.googleAnalyticsId ||
    "";

  if (!measurementId || measurementId.trim() === "" || measurementId.includes("XXXXXXXXXX")) {
    return;
  }

  const cleanId = measurementId.trim();

  // Prevent duplicate script injection
  if (document.getElementById(`ga-script-${cleanId}`)) {
    return;
  }

  // 1. Inject gtag.js script tag dynamically
  const script = document.createElement("script");
  script.id = `ga-script-${cleanId}`;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;
  document.head.appendChild(script);

  // 2. Setup dataLayer & gtag global function
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer?.push(args);
  }
  window.gtag = gtag;

  gtag("js", new Date());
  gtag("config", cleanId, {
    anonymize_ip: true,
  });

  console.log(`[Analytics] Google Analytics initialized with ID: ${cleanId}`);
}

/**
 * Utility to log custom analytics events if GA is initialized.
 */
export function trackEvent(action: string, category: string, label?: string, value?: number): void {
  if (typeof window.gtag === "function") {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
}
