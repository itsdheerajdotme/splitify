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

  // 1. Setup dataLayer & global gtag function FIRST before injecting script
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    // Standard Google Analytics gtag implementation MUST push the arguments object
    window.gtag = function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }

  // 2. Queue initial config & pageview commands in dataLayer
  window.gtag("js", new Date());
  window.gtag("config", cleanId, {
    send_page_view: true,
  });

  // 3. Prevent duplicate script tag injection
  if (document.getElementById(`ga-script-${cleanId}`)) {
    return;
  }

  // 4. Inject gtag.js script tag dynamically into head
  const script = document.createElement("script");
  script.id = `ga-script-${cleanId}`;
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${cleanId}`;
  document.head.appendChild(script);

  console.log(`[Analytics] Google Analytics initialized with ID: ${cleanId}`);
}

/**
 * Sends a custom page_view event to GA4 when navigating client-side.
 */
export function trackPageView(pagePath: string, pageTitle?: string): void {
  const cleanId = siteConfig.analytics?.googleAnalyticsId?.trim();
  if (!cleanId || typeof window.gtag !== "function") return;

  window.gtag("config", cleanId, {
    page_path: pagePath,
    page_title: pageTitle || document.title,
    send_page_view: true,
  });
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
