import { useEffect } from "react";

/**
 * Lightweight SEO hook for client-side rendered apps.
 * Sets document.title and meta description dynamically.
 *
 * Limitation: CSR apps rely on JavaScript execution for these tags.
 * Search engines with JS rendering (Google) will pick them up, but
 * engines without JS rendering will only see the static index.html.
 * For full SSR/SSG SEO, consider migrating to Next.js.
 *
 * @param {object} options
 * @param {string} [options.title] - Page title (appended with " — YouTube")
 * @param {string} [options.description] - Meta description content
 */
export function useSEO({ title, description } = {}) {
  useEffect(() => {
    if (title) {
      document.title = `${title} — YWatch`;
    } else {
      document.title = "YWatch";
    }
  }, [title]);

  useEffect(() => {
    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", "description");
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", description);
    }
  }, [description]);
}
