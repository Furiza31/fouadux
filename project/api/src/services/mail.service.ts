import { eq } from "drizzle-orm";

import type { Mail, NewMail, User } from "../lib/db/schemas";

import db from "../lib/db";
import { provider } from "../lib/db/schemas/provider";
import { useGoogleMailService } from "./google.mail.service";
import { useMicrosoftMailService } from "./microsoft.mail.service";

export function useMailService() {
  const googleMailService = useGoogleMailService();
  const microsoftMailService = useMicrosoftMailService();

  const getProviderService = async (currentUser: User) => {
    const providerName = await db.select().from(provider).where(eq(provider.userId, currentUser.id)).limit(1).then(res => res[0]?.name);
    switch (providerName) {
      case "google":
        return googleMailService;
      case "microsoft":
        return microsoftMailService;
      default:
        throw new Error(`Unsupported provider: ${providerName}`);
    }
  };

  const getMails = async (currentUser: User, page: number = 1): Promise<Mail[]> => {
    const mailService = await getProviderService(currentUser);
    return mailService.getMails(currentUser, page);
  };

  const getMail = async (currentUser: User, mailId: string): Promise<Mail | null> => {
    const mailService = await getProviderService(currentUser);
    return mailService.getMail(currentUser, mailId);
  };

  const insertMail = async (currentUser: User, mailData: NewMail): Promise<Mail> => {
    const mailService = await getProviderService(currentUser);
    return mailService.insertMail(currentUser, mailData);
  };

  const deleteMail = async (currentUser: User, mailId: string): Promise<void> => {
    const mailService = await getProviderService(currentUser);
    return mailService.deleteMail(currentUser, mailId);
  };

  const init = async (currentUser: User) => {
    const mailService = await getProviderService(currentUser);
    return mailService.init(currentUser);
  };

  const dashboard = async (currentUser: User) => {
    const mailService = await getProviderService(currentUser);
    return mailService.dashboard(currentUser);
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
