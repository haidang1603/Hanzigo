import { useEffect } from 'react';
import {
  SITE_NAME,
  buildGlobalJsonLdSchemas,
  getRouteSeoMeta,
} from './routeSeoConfig.js';

function upsertMetaTag(attribute, key, content) {
  if (typeof document === 'undefined' || !document.head) return;
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function upsertLinkTag(rel, href) {
  if (typeof document === 'undefined' || !document.head) return;
  let element = document.head.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

function upsertJsonLdScript(id, schemaPayload) {
  if (typeof document === 'undefined' || !document.head) return;
  let script = document.head.querySelector(`script#${id}[type="application/ld+json"]`);
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  const serialized = JSON.stringify(schemaPayload);
  if (script.textContent !== serialized) {
    script.textContent = serialized;
  }
}

export function applySeoHeadMetadata(activeTab, routeInfo) {
  if (typeof document === 'undefined') return null;

  const meta = getRouteSeoMeta(activeTab, routeInfo);

  document.title = meta.title;
  upsertMetaTag('name', 'description', meta.description);
  upsertMetaTag('name', 'robots', meta.robots);
  upsertLinkTag('canonical', meta.canonicalUrl);

  // OpenGraph
  upsertMetaTag('property', 'og:site_name', SITE_NAME);
  upsertMetaTag('property', 'og:locale', meta.ogLocale);
  upsertMetaTag('property', 'og:type', meta.ogType);
  upsertMetaTag('property', 'og:title', meta.title);
  upsertMetaTag('property', 'og:description', meta.description);
  upsertMetaTag('property', 'og:url', meta.canonicalUrl);
  upsertMetaTag('property', 'og:image', meta.ogImage);

  // Twitter Card
  upsertMetaTag('name', 'twitter:card', meta.twitterCard);
  upsertMetaTag('name', 'twitter:title', meta.title);
  upsertMetaTag('name', 'twitter:description', meta.description);
  upsertMetaTag('name', 'twitter:image', meta.ogImage);

  // Schema.org JSON-LD
  upsertJsonLdScript('hanzigo-jsonld', {
    '@context': 'https://schema.org',
    '@graph': buildGlobalJsonLdSchemas(),
  });

  return meta;
}

export default function SeoHeadManager({ activeTab = 'home', routeInfo = null }) {
  useEffect(() => {
    applySeoHeadMetadata(activeTab, routeInfo);
  }, [activeTab, routeInfo]);

  return null;
}

