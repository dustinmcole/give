import { Resend } from "resend";

// Lazily initialize so missing env var only fails at send time, not import time
let _resend: Resend | null = null;

function getResend(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }
    _resend = new Resend(apiKey);
  }
  return _resend;
}

export function getFromEmail(): string {
  return process.env.RESEND_FROM_EMAIL ?? "receipts@give.example.com";
}

export { getResend };
