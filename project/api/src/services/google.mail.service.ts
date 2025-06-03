import { and, count, desc, eq } from "drizzle-orm";

import type { Mail, NewMail, User } from "../lib/db/schemas";

import db from "../lib/db";
import { mail } from "../lib/db/schemas";
import { provider } from "../lib/db/schemas/provider";

export function useGoogleMailService() {
  const API_ENDPOINT = "https://www.googleapis.com/gmail/v1";
  const MAIL_TO_SAVE_IN_DB = 50;
  const MAIL_PER_PAGE = 10;

  const getHeader = (token: string) => ({
    "Authorization": `Bearer ${token}`,
    "Content-Type": "application/json",
  });

  const getUserToken = async (currentUser: User): Promise<string> => {
    const userFound = await db
      .select()
      .from(provider)
      .where(eq(provider.userId, currentUser.id))
      .limit(1)
      .then(res => res[0]);

    if (!userFound) {
      throw new Error("User not found");
    }
    if (userFound.name !== "google") {
      throw new Error("User is not a Google user");
    }
    if (!userFound.token) {
      throw new Error("User token not found");
    }
    if (new Date(userFound.expireAt) < new Date()) {
      throw new Error("User token has expired");
    }
    return userFound.token;
  };

  const getMailsFromGoogle = async (
    currentUser: User,
    page: number = 1,
    mailsPerPage: number = MAIL_PER_PAGE,
  ): Promise<Mail[]> => {
    const token = await getUserToken(currentUser);
    let pageToken: string | undefined;

    for (let i = 1; i < page; i++) {
      const params = new URLSearchParams();
      params.set("maxResults", String(mailsPerPage));
      if (pageToken) {
        params.set("pageToken", pageToken);
      }

      const listRes = await fetch(
        `${API_ENDPOINT}/users/me/messages?${params.toString()}`,
        {
          headers: getHeader(token),
        },
      );
      if (!listRes.ok) {
        const text = await listRes.text();
        throw new Error(`Lecture des mails échouée (${listRes.status}): ${text}`);
      }
      const listJson = await listRes.json();
      pageToken = listJson.nextPageToken;
      if (!pageToken) {
        return [];
      }
    }

    const params = new URLSearchParams();
    params.set("maxResults", String(mailsPerPage));
    if (pageToken) {
      params.set("pageToken", pageToken);
    }

    const listRes = await fetch(
      `${API_ENDPOINT}/users/me/messages?${params.toString()}`,
      {
        headers: getHeader(token),
      },
    );
    if (!listRes.ok) {
      const text = await listRes.text();
      throw new Error(`Lecture des mails échouée (${listRes.status}): ${text}`);
    }
    const listJson = await listRes.json();
    const messages = listJson.messages ?? [];

    if (!Array.isArray(messages) || messages.length === 0) {
      return [];
    }

    const mails: Mail[] = [];
    for (const m of messages) {
      const msgRes = await fetch(
        `${API_ENDPOINT}/users/me/messages/${m.id}?format=full`,
        { headers: getHeader(token) },
      );
      if (!msgRes.ok) {
        const text = await msgRes.text();
        throw new Error(`Lecture du mail ${m.id} échouée (${msgRes.status}): ${text}`);
      }
      const msg = await msgRes.json();

      const headers: Record<string, string> = {};
      for (const h of msg.payload.headers) {
        headers[h.name.toLowerCase()] = h.value;
      }

      let rawBody = msg.payload.body?.data || "";
      if (msg.payload.parts) {
        const part = (msg.payload.parts as any[]).find(
          p => p.mimeType === "text/plain",
        );
        if (part) {
          rawBody = part.body.data;
        }
      }

      const decodedBody = rawBody
        ? decodeURIComponent(
            atob(rawBody.replace(/-/g, "+").replace(/_/g, "/"))
              .split("")
              .map(c =>
                `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`,
              )
              .join(""),
          )
        : "";

      mails.push({
        id: msg.id,
        subject: headers.subject ?? "",
        sender: headers.from ?? "",
        body: decodedBody,
        date: new Date(headers.date ?? "").toISOString(),
        userId: currentUser.id,
        to: currentUser.email,
      });
    }

    return mails;
  };

  const init = async (currentUser: User) => {
    const mailCount = await db
      .select({ count: count() })
      .from(mail)
      .where(eq(mail.userId, currentUser.id))
      .then(res => res[0].count);

    if (mailCount >= MAIL_TO_SAVE_IN_DB) {
      return;
    }
    const mails = await getMailsFromGoogle(currentUser, 1, MAIL_TO_SAVE_IN_DB);
    if (mails.length === 0) {
      return;
    }
    await db
      .insert(mail)
      .values(
        mails.map(m => ({
          ...m,
          userId: currentUser.id,
        })),
      )
      .onConflictDoNothing();
  };

  const getMails = async (
    currentUser: User,
    page: number = 1,
  ): Promise<Mail[]> => {
    const mailCount = await db
      .select({ count: count() })
      .from(mail)
      .where(eq(mail.userId, currentUser.id))
      .then(res => res[0].count);

    if (page * MAIL_PER_PAGE > mailCount) {
      const newMails = await getMailsFromGoogle(
        currentUser,
        page,
        MAIL_TO_SAVE_IN_DB,
      );
      if (newMails.length === 0) {
        return db
          .select()
          .from(mail)
          .where(eq(mail.userId, currentUser.id))
          .limit(MAIL_PER_PAGE)
          .offset((page - 1) * MAIL_PER_PAGE)
          .orderBy(desc(mail.date));
      }
      await db
        .insert(mail)
        .values(
          newMails.map(m => ({
            ...m,
            userId: currentUser.id,
          })),
        )
        .onConflictDoNothing();
      return newMails.splice(0, MAIL_PER_PAGE).sort(
        (a, b) =>
          new Date(b.date ?? "").getTime() - new Date(a.date ?? "").getTime(),
      );
    }

    return db
      .select()
      .from(mail)
      .where(eq(mail.userId, currentUser.id))
      .limit(MAIL_PER_PAGE)
      .offset((page - 1) * MAIL_PER_PAGE)
      .orderBy(desc(mail.date));
  };

  const getMail = async (
    currentUser: User,
    mailId: string,
  ): Promise<Mail | null> => {
    const mailFound = await db
      .select()
      .from(mail)
      .where(
        and(eq(mail.id, mailId), eq(mail.userId, currentUser.id)),
      )
      .limit(1)
      .then(res => res[0]);
    if (!mailFound) {
      throw new Error("Mail not found");
    }
    return mailFound;
  };

  const insertMail = async (
    currentUser: User,
    mailData: NewMail,
  ): Promise<Mail> => {
    return await db.insert(mail).values({
      ...mailData,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      userId: currentUser.id,
    }).returning().then(res => res[0]);
  };

  const deleteMail = async (
    currentUser: User,
    mailId: string,
  ): Promise<void> => {
    await db.delete(mail).where(
      and(eq(mail.id, mailId), eq(mail.userId, currentUser.id)),
    );
  };

  const dashboard = async (currentUser: User) => {
    const mailCount = await db
      .select({ count: count() })
      .from(mail)
      .where(eq(mail.userId, currentUser.id))
      .then(res => res[0].count);

    const contactCount = await db
      .selectDistinct({ count: count(mail.sender) })
      .from(mail)
      .where(eq(mail.userId, currentUser.id))
      .then(res => res[0].count);
    return {
      totalMails: mailCount,
      totalContacts: contactCount,
    };
  };

  return {
    init,
    getMails,
    getMail,
    insertMail,
    deleteMail,
    dashboard,
  };
}
