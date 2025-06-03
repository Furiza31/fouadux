import { and, count, desc, eq } from "drizzle-orm";

import type { Mail, NewMail, User } from "../lib/db/schemas";

import db from "../lib/db";
import { mail } from "../lib/db/schemas";
import { provider } from "../lib/db/schemas/provider";

export function useMicrosoftMailService() {
  const API_ENDPOINT = "https://graph.microsoft.com/v1.0";
  const MAIL_TO_SAVE_IN_DB = 50;
  const MAIL_PER_PAGE = 10;

  const getHeader = (token: string) => {
    return {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  };

  const getUserToken = async (currentUser: User): Promise<string> => {
    const userFound = await db.select().from(provider).where(eq(provider.userId, currentUser.id)).limit(1).then(res => res[0]);
    if (!userFound) {
      throw new Error("User not found");
    }
    if (userFound.name !== "microsoft") {
      throw new Error("User is not a Microsoft user");
    }
    if (!userFound.token) {
      throw new Error("User token not found");
    }
    if (new Date(userFound.expireAt) < new Date()) {
      throw new Error("User token has expired");
    }
    return userFound.token;
  };

  const getMailsFromMicrosoft = async (currentUser: User, page: number = 1, mailsPerPage: number = MAIL_PER_PAGE): Promise<Mail[]> => {
    const skip = (page - 1) * mailsPerPage;
    const query = `?$top=${mailsPerPage}&$skip=${skip}&$select=id,subject,from,receivedDateTime,bodyPreview`;

    const headers = getHeader(await getUserToken(currentUser));

    const res = await fetch(`${API_ENDPOINT}/me/messages${query}`, {
      headers,
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Lecture des mails échouée (${res.status}): ${text}`);
    }

    const json = await res.json() as { value: Array<{
      id: string;
      subject: string;
      from: { emailAddress: { address: string } };
      receivedDateTime: string;
      bodyPreview: string;
    }>; };

    return json.value.map((item: {
      id: string;
      subject: string;
      from: { emailAddress: { address: string } };
      receivedDateTime: string;
      bodyPreview: string;
    }) => ({
      id: item.id,
      subject: item.subject,
      sender: item.from?.emailAddress.address ?? "",
      body: item.bodyPreview,
      date: new Date(item.receivedDateTime).toISOString(),
      userId: currentUser.id,
      to: currentUser.email,
    }));
  };

  const init = async (currentUser: User) => {
    const mailCount = await db.select({ count: count() }).from(mail).where(eq(mail.userId, currentUser.id)).then(res => res[0].count);
    if (mailCount >= MAIL_TO_SAVE_IN_DB) {
      return;
    }
    const mails = await getMailsFromMicrosoft(currentUser, 1, MAIL_TO_SAVE_IN_DB);
    if (mails.length === 0)
      return;
    await db.insert(mail).values(mails).onConflictDoNothing();
  };

  const getMails = async (currentUser: User, page: number = 1): Promise<Mail[]> => {
    const mailCount = await db.select({ count: count() }).from(mail).where(eq(mail.userId, currentUser.id)).then(res => res[0].count);
    if (page * MAIL_PER_PAGE > mailCount) {
      const newMails = await getMailsFromMicrosoft(currentUser, page, MAIL_TO_SAVE_IN_DB);
      if (newMails.length === 0) {
        return db.select().from(mail).where(eq(mail.userId, currentUser.id)).limit(MAIL_PER_PAGE).offset((page - 1) * MAIL_PER_PAGE).orderBy(desc(mail.date));
      }
      await db.insert(mail).values(newMails).onConflictDoNothing();
      return newMails.slice(0, MAIL_PER_PAGE).sort(
        (a, b) =>
          new Date(a.date ?? "").getTime() - new Date(b.date ?? "").getTime(),
      );
    }
    return db.select().from(mail).where(eq(mail.userId, currentUser.id)).limit(MAIL_PER_PAGE).offset((page - 1) * MAIL_PER_PAGE).orderBy(desc(mail.date));
  };

  const getMail = async (currentUser: User, mailId: string): Promise<Mail | null> => {
    const mailFound = await db.select().from(mail).where(and(eq(mail.id, mailId), eq(mail.userId, currentUser.id))).limit(1).then(res => res[0]);
    if (!mailFound) {
      throw new Error("Mail not found");
    }
    return mailFound;
  };

  const insertMail = async (currentUser: User, mailData: NewMail): Promise<Mail> => {
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
    const mailCount = await db.select({ count: count() }).from(mail).where(eq(mail.userId, currentUser.id)).then(res => res[0].count);
    return {
      mailCount,
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
