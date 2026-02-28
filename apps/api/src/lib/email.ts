import { Resend } from "resend";

const apiKey = process.env.RESEND_API_KEY;
export const resend = apiKey ? new Resend(apiKey) : null;
export const fromEmail = process.env.FROM_EMAIL ?? "receipts@give.to";
