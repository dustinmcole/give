"use client";

import { useEffect } from "react";

/**
 * EmbedResizer — mounts inside the /embed/* page.
 *
 * Sends `{ type: "give:resize", height: <px> }` to `window.parent`
 * via postMessage whenever the document height changes.
 *
 * The parent page's embed.js (or manually written code) listens for this
 * message and resizes the iframe accordingly, enabling seamless auto-height.
 */
export default function EmbedResizer() {
  useEffect(() => {
    function sendHeight() {
      const height = document.documentElement.scrollHeight;
      window.parent.postMessage(
        { type: "give:resize", height },
        "*" // allow any parent origin — the nonprofit controls their own page
      );
    }

    // Send on mount
    sendHeight();

    // Observe body size changes (form state changes, errors, etc.)
    const observer = new ResizeObserver(sendHeight);
    observer.observe(document.body);

    // Also send after a short delay to catch async renders
    const timer = setTimeout(sendHeight, 500);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  // Renders nothing — purely a side-effect component
  return null;
}
