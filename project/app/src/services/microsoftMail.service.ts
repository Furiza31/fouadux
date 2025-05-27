import { type Mail, type MailForm, type MailService } from "@/types/mail";
import type { User } from "@/types/user";

const GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0";

class MicrosoftMailService implements MailService {
  private getHeaders(token: string) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  async sendMail(user: User, mail: MailForm): Promise<void> {
    const payload = {
      message: {
        subject: mail.subject,
        body: {
          contentType: "Text",
          content: mail.body,
        },
        toRecipients: [
          {
            emailAddress: {
              address: mail.to,
            },
          },
        ],
      },
      saveToSentItems: true,
    };

    const res = await fetch(`${GRAPH_ENDPOINT}/me/sendMail`, {
      method: "POST",
      headers: this.getHeaders(user.token),
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Envoi échoué (${res.status}): ${text}`);
    }
  }

  async getMails(user: User, page: number): Promise<Mail[]> {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const query = `?$top=${pageSize}&$skip=${skip}&$select=id,subject,from,receivedDateTime,bodyPreview`;

    const res = await fetch(`${GRAPH_ENDPOINT}/me/messages${query}`, {
      headers: this.getHeaders(user.token),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Lecture des mails échouée (${res.status}): ${text}`);
    }

    const json = await res.json();
    return json.value.map((item: any) => ({
      id: item.id,
      subject: item.subject,
      sender: item.from?.emailAddress.address ?? "",
      body: item.bodyPreview,
      date: new Date(item.receivedDateTime),
    }));
  }

  async getMail(user: User, id: string): Promise<Mail> {
    const select = "?$select=id,subject,from,receivedDateTime,body";
    const res = await fetch(`${GRAPH_ENDPOINT}/me/messages/${id}${select}`, {
      headers: this.getHeaders(user.token),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Lecture du mail ${id} échouée (${res.status}): ${text}`);
    }

    const item = await res.json();
    return {
      id: item.id,
      subject: item.subject,
      sender: item.from?.emailAddress.address ?? "",
      body: item.body.content,
      date: new Date(item.receivedDateTime),
    };
  }

  async deleteMail(user: User, id: string): Promise<void> {
    const res = await fetch(`${GRAPH_ENDPOINT}/me/messages/${id}`, {
      method: "DELETE",
      headers: this.getHeaders(user.token),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Suppression du mail ${id} échouée (${res.status}): ${text}`
      );
    }
  }
}

const microsoftMailService = new MicrosoftMailService();
export { microsoftMailService };
