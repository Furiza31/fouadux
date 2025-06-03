export interface Mail {
  id: string;
  subject: string;
  sender: string;
  body: string;
  date: Date;
  to: string;
}

export interface MailForm {
  to: string;
  subject: string;
  body: string;
}
