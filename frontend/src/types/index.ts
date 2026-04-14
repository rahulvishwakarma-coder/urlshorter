// ── Shared Types ──────────────────────────────────────────────────────────────

export interface User {
  _id: string;
  fullName: string;
  email: string;
  tokensUsed: number;
  tokenLimit: number;
}

export interface UrlEntry {
  _id: string;
  title?: string;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: string;
}

export interface ApiErrorResponse {
  message?: string;
}

export interface RedirectedResponse {
  originalUrl?: string;
  url?: string;
  redirectUrl?: string;
}