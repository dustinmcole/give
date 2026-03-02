"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";

interface CampaignQRCodeProps {
  /** URL to encode in the QR code */
  url: string;
  /** Campaign slug for the downloaded filename */
  campaignSlug: string;
  /** Display size in px (default 256) */
  size?: number;
}

export default function CampaignQRCode({
  url,
  campaignSlug,
  size = 256,
}: CampaignQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState<string | null>(null);

  // Render QR code to canvas on mount / URL change
  useEffect(() => {
    if (!canvasRef.current || !url) return;
    setError(null);
    QRCode.toCanvas(canvasRef.current, url, {
      width: size,
      margin: 2,
      color: {
        dark: "#111827",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    }).catch((err: unknown) => {
      console.error("QR code generation failed:", err);
      setError("Failed to generate QR code.");
    });
  }, [url, size]);

  // Download high-res PNG (1024x1024)
  async function handleDownload() {
    try {
      const dataUrl = await QRCode.toDataURL(url, {
        width: 1024,
        margin: 2,
        color: {
          dark: "#111827",
          light: "#ffffff",
        },
        errorCorrectionLevel: "H",
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `give-qr-${campaignSlug}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("QR download failed:", err);
    }
  }

  if (error) {
    return (
      <div className="text-xs text-red-500 py-2">{error}</div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        className="rounded-lg border border-gray-100"
        style={{ maxWidth: "100%", height: "auto" }}
      />
      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download QR Code
      </button>
    </div>
  );
}
