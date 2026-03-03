/**
 * Give — Embeddable Donation Widget (Popup Modal)
 * ================================================
 * Lightweight vanilla JS (<5 KB). No React dependency.
 *
 * Usage:
 *   <script
 *     src="https://give.fund/embed.js"
 *     data-campaign="<campaignId>"
 *     data-text="Donate Now"
 *     data-color="#2563eb"
 *     data-theme="light"
 *   ></script>
 *
 * Supported data attributes:
 *   data-campaign  (required) Campaign ID
 *   data-text      Button label (default: "Donate Now")
 *   data-color     Button background colour (default: #2563eb)
 *   data-theme     "light" | "dark" (default: "light")
 *   data-amount    Pre-fill a specific amount (optional, unused by current form)
 */
(function () {
  "use strict";

  // ── Config from script tag ──────────────────────────────────
  var currentScript = document.currentScript || (function () {
    var s = document.getElementsByTagName("script");
    return s[s.length - 1];
  })();

  var campaignId = currentScript.getAttribute("data-campaign");
  var buttonText = currentScript.getAttribute("data-text") || "Donate Now";
  var buttonColor = currentScript.getAttribute("data-color") || "#2563eb";
  var theme = currentScript.getAttribute("data-theme") || "light";

  if (!campaignId) {
    console.warn("[give/embed.js] Missing data-campaign attribute.");
    return;
  }

  // Validate buttonColor to prevent style injection
  if (!/^#[0-9a-fA-F]{3,8}$/.test(buttonColor)) {
    buttonColor = "#2563eb";
  }

  // ── Determine base URL from script src ─────────────────────
  var scriptSrc = currentScript.src || "";
  var baseUrl = scriptSrc
    ? scriptSrc.replace(/\/embed\.js(\?.*)?$/, "")
    : "https://givewith.us";

  var embedSrc =
    baseUrl + "/embed/" + campaignId + (theme === "dark" ? "?theme=dark" : "");

  // ── Inject styles ───────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent = [
    ".give-btn{display:inline-flex;align-items:center;justify-content:center;",
    "gap:8px;padding:12px 24px;border:none;border-radius:8px;",
    "font-size:15px;font-weight:600;cursor:pointer;transition:opacity .15s,transform .1s;",
    "font-family:system-ui,-apple-system,sans-serif;line-height:1.2;white-space:nowrap;}",
    ".give-btn:hover{opacity:.88;transform:translateY(-1px);}",
    ".give-btn:active{transform:translateY(0);}",
    ".give-btn svg{flex-shrink:0;}",
    ".give-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);",
    "z-index:2147483646;display:flex;align-items:center;justify-content:center;",
    "padding:16px;backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);}",
    ".give-modal{background:#fff;border-radius:16px;overflow:hidden;",
    "position:relative;width:100%;max-width:480px;max-height:90vh;",
    "box-shadow:0 24px 80px rgba(0,0,0,.25);display:flex;flex-direction:column;}",
    ".give-modal-header{display:flex;align-items:center;justify-content:space-between;",
    "padding:14px 16px;border-bottom:1px solid #f3f4f6;flex-shrink:0;}",
    ".give-modal-title{font-size:14px;font-weight:600;color:#374151;",
    "font-family:system-ui,-apple-system,sans-serif;}",
    ".give-modal-close{background:none;border:none;cursor:pointer;",
    "width:32px;height:32px;border-radius:8px;display:flex;align-items:center;",
    "justify-content:center;color:#9ca3af;transition:background .15s,color .15s;}",
    ".give-modal-close:hover{background:#f3f4f6;color:#374151;}",
    ".give-modal iframe{flex:1;width:100%;border:none;min-height:500px;}",
  ].join("");
  document.head.appendChild(style);

  // ── Create button ───────────────────────────────────────────
  var btn = document.createElement("button");
  btn.className = "give-btn give-donate-btn";
  btn.setAttribute("type", "button");
  btn.setAttribute("aria-label", buttonText);
  btn.style.backgroundColor = buttonColor;
  btn.style.color = "#ffffff";

  // Heart icon — safe static SVG
  var iconSvg =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">' +
    '<path d="M12 21.593c-.425-.492-8.77-7.908-8.77-12.222C3.23 5.775 5.64 3.5 8.5 3.5c1.742 0 3.296.878 4.25 2.217A5.062 5.062 0 0117 3.5c2.86 0 5.27 2.275 5.27 5.871 0 4.314-8.345 11.73-8.77 12.222L12 21.593z"/>' +
    "</svg>";

  // Use textContent for user-controlled text to prevent XSS
  btn.innerHTML = iconSvg;
  var btnSpan = document.createElement("span");
  btnSpan.textContent = buttonText;
  btn.appendChild(btnSpan);

  // ── Modal creation ──────────────────────────────────────────
  var overlay = null;
  var iframe = null;
  var closeBtn = null;

  function openModal() {
    if (overlay) return; // already open

    overlay = document.createElement("div");
    overlay.className = "give-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Donation form");

    var modal = document.createElement("div");
    modal.className = "give-modal";

    // Header
    var header = document.createElement("div");
    header.className = "give-modal-header";

    var title = document.createElement("span");
    title.className = "give-modal-title";
    title.textContent = "Make a Donation";

    closeBtn = document.createElement("button");
    closeBtn.className = "give-modal-close";
    closeBtn.setAttribute("type", "button");
    closeBtn.setAttribute("aria-label", "Close donation form");
    closeBtn.innerHTML =
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.addEventListener("click", closeModal);

    header.appendChild(title);
    header.appendChild(closeBtn);

    // Iframe
    iframe = document.createElement("iframe");
    iframe.src = embedSrc;
    iframe.setAttribute("title", "Donation form");
    iframe.setAttribute("scrolling", "auto");
    iframe.setAttribute("allowpaymentrequest", "true");

    modal.appendChild(header);
    modal.appendChild(iframe);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Prevent body scroll
    document.body.style.overflow = "hidden";

    // Focus close button on open (a11y)
    closeBtn.focus();

    // Close on overlay click (outside modal)
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal();
    });

    // Close on Escape + focus trap
    document.addEventListener("keydown", handleKeydown);

    // Auto-resize iframe height via postMessage
    window.addEventListener("message", handleIframeMessage);
  }

  function closeModal() {
    if (!overlay) return;
    overlay.remove();
    overlay = null;
    iframe = null;
    closeBtn = null;
    document.body.style.overflow = "";
    document.removeEventListener("keydown", handleKeydown);
    window.removeEventListener("message", handleIframeMessage);
    // Return focus to trigger button
    btn.focus();
  }

  function handleKeydown(e) {
    if (e.key === "Escape") {
      closeModal();
      return;
    }
    // Focus trap between close button and iframe
    if (e.key === "Tab" && closeBtn && iframe) {
      var focusables = [closeBtn, iframe];
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }

  function handleIframeMessage(e) {
    if (!iframe) return;
    // Validate message source
    if (e.source !== iframe.contentWindow) return;
    var data = e.data;
    if (data && data.type === "give:resize" && typeof data.height === "number") {
      // Add header height (≈57px) + small buffer
      iframe.style.minHeight = Math.min(data.height + 57, window.innerHeight * 0.85) + "px";
    }
  }

  btn.addEventListener("click", openModal);

  // ── Insert button after script tag ─────────────────────────
  // Insert right after the script element so placement is intuitive
  if (currentScript.parentNode) {
    currentScript.parentNode.insertBefore(
      btn,
      currentScript.nextSibling
    );
  } else {
    document.body.appendChild(btn);
  }
})();
