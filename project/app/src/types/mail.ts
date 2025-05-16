export interface Mail {
  id: number;
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
