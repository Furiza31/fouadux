declare namespace NodeJS {
  interface ProcessEnv {
    PORT: string;
    DATABASE_URL: string;
    AUTH_SECRET: string;
    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;
    AUTH_MICROSOFT_ENTRA_ID_ID: string;
    AUTH_MICROSOFT_ENTRA_ID_SECRET: string;
    AUTH_MICROSOFT_ENTRA_ID_ISSUER: string;
  }
}
