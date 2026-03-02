"use client";

import { useState } from "react";

interface EmbedCodePanelProps {
  campaignId: string;
}

type EmbedTab = "iframe" | "script" | "link";

interface CodeBlockProps {
  code: string;
  label: string;
}

// ── Small helper: code block + copy button ────────────────

function CodeBlock({ code, label }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for environments without clipboard API
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
          {label}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition-colors"
        >
          {copied ? (
            <>
              <svg
                className="w-3.5 h-3.5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="bg-gray-950 text-gray-100 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all">
        {code}
      </pre>
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────

export default function EmbedCodePanel({ campaignId }: EmbedCodePanelProps) {
  const [activeTab, setActiveTab] = useState<EmbedTab>("iframe");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [previewOpen, setPreviewOpen] = useState(false);

  const appUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : process.env.NEXT_PUBLIC_APP_URL ?? "https://givewith.us";

  const embedUrl = `${appUrl}/embed/${campaignId}${theme === "dark" ? "?theme=dark" : ""}`;
  const directUrl = `${appUrl}/donate/${campaignId}`;

  const iframeCode = `<iframe
  src="${embedUrl}"
  width="100%"
  height="600"
  frameborder="0"
  scrolling="no"
  style="border:none;max-width:480px;border-radius:12px;"
  title="Donation form"
></iframe>
<script>
  /* Auto-resize iframe height based on form state */
  window.addEventListener("message", function(e) {
    if (e.data && e.data.type === "give:resize") {
      var iframes = document.querySelectorAll('iframe[title="Donation form"]');
      iframes.forEach(function(f) {
        if (f.src.indexOf("${appUrl}/embed/") !== -1) {
          f.style.height = e.data.height + "px";
        }
      });
    }
  });
</script>`.trim();

  const scriptCode = `<script
  src="${appUrl}/embed.js"
  data-campaign="${campaignId}"
  data-text="Donate Now"
  data-color="#2563eb"
  data-theme="${theme}"
></script>`.trim();

  const TABS: { id: EmbedTab; label: string; description: string }[] = [
    {
      id: "iframe",
      label: "Iframe Embed",
      description:
        "Paste the form directly into your page. Automatically resizes as donors interact.",
    },
    {
      id: "script",
      label: "Popup Button",
      description:
        'Adds a "Donate Now" button to your page. Opens the form in a modal overlay.',
    },
    {
      id: "link",
      label: "Direct Link",
      description: "Link donors to a standalone hosted donation page.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Tabs ──────────────────────────────────────── */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Tab description ───────────────────────────── */}
      <p className="text-sm text-gray-500">
        {TABS.find((t) => t.id === activeTab)?.description}
      </p>

      {/* ── Theme selector (iframe + script) ─────────── */}
      {activeTab !== "link" && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700">Theme:</span>
          <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTheme(t)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                  theme === t
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Code blocks ───────────────────────────────── */}
      {activeTab === "iframe" && (
        <CodeBlock code={iframeCode} label="Paste into your website HTML" />
      )}
      {activeTab === "script" && (
        <CodeBlock
          code={scriptCode}
          label="Add before </body> on your website"
        />
      )}
      {activeTab === "link" && (
        <CodeBlock code={directUrl} label="Direct donation page URL" />
      )}

      {/* ── Preview toggle (iframe only) ──────────────── */}
      {activeTab === "iframe" && (
        <div>
          <button
            type="button"
            onClick={() => setPreviewOpen((v) => !v)}
            className="inline-flex items-center gap-2 text-sm font-medium text-give-primary hover:text-give-primary-dark transition-colors"
          >
            <svg
              className={`w-4 h-4 transition-transform ${previewOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {previewOpen ? "Hide preview" : "Show preview"}
          </button>

          {previewOpen && (
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
              <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-red-400" />
                  <span className="w-3 h-3 rounded-full bg-yellow-400" />
                  <span className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <span className="text-xs text-gray-500 ml-1 font-mono truncate">
                  {embedUrl}
                </span>
              </div>
              <iframe
                src={embedUrl}
                width="100%"
                height="700"
                frameBorder="0"
                scrolling="no"
                title="Embed preview"
                className="w-full block"
                style={{ minHeight: 500 }}
              />
            </div>
          )}
        </div>
      )}

      {/* ── Notes ─────────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-sm text-blue-800 space-y-1">
        <p className="font-semibold">Tips:</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li>
            The iframe auto-resizes as donors fill in the form — no fixed height
            required.
          </li>
          <li>
            The popup button embed requires no additional CSS — it handles its
            own styles.
          </li>
          <li>
            Your organization&apos;s branding (name, logo) is retained in all
            embed types.
          </li>
        </ul>
      </div>
    </div>
  );
}
