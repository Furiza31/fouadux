import type { User } from "./user";

export interface Mail {
  id: string;
  subject: string;
  sender: string;
  body: string;
  date: Date;
}

export interface MailForm {
  to: string;
  subject: string;
  body: string;
}

export interface MailService {
  sendMail(user: User, mail: MailForm): Promise<void>;
  getMails(user: User, page: number): Promise<Mail[]>;
  getMail(user: User, id: string): Promise<Mail>;
  deleteMail(user: User, id: string): Promise<void>;
}
