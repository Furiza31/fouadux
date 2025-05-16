import { ExpressAuthConfig } from "@auth/express";
import Google from "@auth/express/providers/google";
import Entra from "@auth/express/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: ExpressAuthConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Entra({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: { strategy: "database" },
  callbacks: {
    redirect: async ({ url, baseUrl }) => {
      return "http://localhost:3000/auth/popup-callback";
    },
  },
};
