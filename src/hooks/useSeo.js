import { useEffect } from "react";

/**
 * Custom SEO Hook - React 19 Compatible
 * Fully dynamic + production safe
 */
const useSeo = (seo) => {
  useEffect(() => {
    if (!seo) return;

    const BASE_URL = window.location.origin;

    // 🎯 Title
    document.title = seo.title || "AcademicArk - AKTU Notes & Study Material";

    // 📝 Meta Description
    updateMetaTag("name", "description", seo.metaDescription);

    // 🔑 Keywords
    if (seo.keywords?.length) {
      updateMetaTag("name", "keywords", seo.keywords.join(", "));
    }

    // 🤖 Robots (if you use noIndex later)
    updateMetaTag(
  "name",
  "robots",
  seo.noIndex ? "noindex,follow" : "index,follow"
);


    // 🌐 Open Graph
    updateMetaTag("property", "og:title", seo.title);
    updateMetaTag("property", "og:description", seo.metaDescription);
    updateMetaTag("property", "og:type", "website");
    updateMetaTag("property", "og:url", `${BASE_URL}/${seo.slug}`);
    updateMetaTag("property", "og:site_name", "AcademicArk");

    // 🐦 Twitter
    updateMetaTag("name", "twitter:card", "summary_large_image");
    updateMetaTag("name", "twitter:title", seo.title);
    updateMetaTag("name", "twitter:description", seo.metaDescription);

    // 🔗 Canonical
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    const currentPath = window.location.pathname;
canonical.setAttribute("href", `${BASE_URL}${currentPath}`);

    // 📊 Structured Data (replace old one safely)
    const existingSchema = document.getElementById("schema-markup");
    if (existingSchema) {
      existingSchema.remove();
    }

    if (seo.schemaMarkup) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.id = "schema-markup";
      script.textContent = JSON.stringify(seo.schemaMarkup);
      document.head.appendChild(script);
    }

    // 🧹 Cleanup
    return () => {
      document.title = "AcademicArk - AKTU Notes & Study Material";

      const oldSchema = document.getElementById("schema-markup");
      if (oldSchema) oldSchema.remove();
    };
  }, [seo]);
};

/**
 * Helper to update or create meta tags
 */
function updateMetaTag(attribute, key, content) {
  if (!content) return;

  let element = document.querySelector(`meta[${attribute}='${key}']`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

export default useSeo;
