import { mails } from "@/components/mails/mails";
import type { Mail } from "@/types/mail";

export const useMailsService = () => {
  const getMails = async (): Promise<{ data: Mail[] }> => {
    return {
      data: mails,
    };
  };

  const getMailById = async (id: number): Promise<{ data: Mail }> => {
    const reponse = mails.find((mail) => mail.id === id);
    if (!reponse) {
      throw new Error("Mail not found");
    }
    return {
      data: reponse,
    };
  };

  const sendMail = async (mail: Mail): Promise<{ data: Mail }> => {
    const newMail = {
      ...mail,
      id: mails.length + 1,
    };
    mails.push(newMail);
    return {
      data: newMail,
    };
  };

  return { getMails, getMailById, sendMail };
};
