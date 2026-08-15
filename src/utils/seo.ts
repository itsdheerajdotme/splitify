import seoConfig from "../config/seo.json";
import { trackPageView } from "../services/analytics";

export interface SEOPageData {
  path: string;
  title: string;
  description: string;
  keywords: string;
  canonical: string;
  og: {
    title: string;
    description: string;
    type: string;
    url: string;
    image: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
  };
  jsonLd: Record<string, unknown>;
}

export type SEOPageKey = "home" | "demo" | "help" | "terms" | "privacy";

/**
 * Returns SEO data for a given page key or pathname
 */
export function getSEOForPath(pathname: string): SEOPageData {
  const cleanPath = pathname.replace(/\/$/, "") || "/";

  if (cleanPath === "/demo") {
    return seoConfig.pages.demo as SEOPageData;
  }
  if (cleanPath === "/help") {
    return seoConfig.pages.help as SEOPageData;
  }
  if (cleanPath === "/terms") {
    return seoConfig.pages.terms as SEOPageData;
  }
  if (cleanPath === "/privacy") {
    return seoConfig.pages.privacy as SEOPageData;
  }
  return seoConfig.pages.home as SEOPageData;
}

/**
 * Helper to update meta tag content or create it if missing
 */
function setMetaTag(attributeName: string, attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/**
 * Helper to update canonical link element
 */
function setCanonical(url: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", url);
}

/**
 * Helper to inject or update JSON-LD script block
 */
function setJsonLd(schema: Record<string, unknown>) {
  let script = document.querySelector<HTMLScriptElement>("script[type='application/ld+json']#seo-jsonld");
  if (!script) {
    script = document.createElement("script");
    script.setAttribute("type", "application/ld+json");
    script.setAttribute("id", "seo-jsonld");
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema, null, 2);
}

/**
 * Apply SEO tags dynamically to document head & track pageview in Google Analytics
 */
export function applySEO(pageKeyOrPath: SEOPageKey | string): SEOPageData {
  let pageData: SEOPageData;

  if (pageKeyOrPath in seoConfig.pages) {
    pageData = (seoConfig.pages as Record<string, SEOPageData>)[pageKeyOrPath];
  } else {
    pageData = getSEOForPath(pageKeyOrPath);
  }

  if (typeof document === "undefined") return pageData;

  // Title
  document.title = pageData.title;

  // Standard Meta Tags
  setMetaTag("name", "description", pageData.description);
  setMetaTag("name", "keywords", pageData.keywords);

  // Canonical
  setCanonical(pageData.canonical);

  // Open Graph
  setMetaTag("property", "og:title", pageData.og.title);
  setMetaTag("property", "og:description", pageData.og.description);
  setMetaTag("property", "og:type", pageData.og.type);
  setMetaTag("property", "og:url", pageData.og.url);
  setMetaTag("property", "og:image", pageData.og.image);
  setMetaTag("property", "og:site_name", seoConfig.site.name);

  // Twitter Card
  setMetaTag("name", "twitter:card", pageData.twitter.card);
  setMetaTag("name", "twitter:title", pageData.twitter.title);
  setMetaTag("name", "twitter:description", pageData.twitter.description);
  setMetaTag("name", "twitter:image", pageData.twitter.image);
  if (seoConfig.site.twitterHandle) {
    setMetaTag("name", "twitter:site", seoConfig.site.twitterHandle);
  }

  // JSON-LD Structured Data
  setJsonLd(pageData.jsonLd);

  // Trigger Google Analytics PageView event
  trackPageView(pageData.path, pageData.title);

  return pageData;
}
