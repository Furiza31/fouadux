import { type Mail, type MailForm, type MailService } from "@/types/mail";
import type { User } from "@/types/user";

const GMAIL_ENDPOINT = "https://www.googleapis.com/gmail/v1";

class GoogleMailService implements MailService {
  private getHeaders(token: string) {
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };
  }

  private encodeMessage(to: string, subject: string, body: string): string {
    const lines = [
      `To: ${to}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset="UTF-8"`,
      ``,
      body,
    ];
    const message = lines.join("\r\n");

    return btoa(message)
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async sendMail(user: User, mail: MailForm): Promise<void> {
    const raw = this.encodeMessage(mail.to, mail.subject, mail.body);
    const res = await fetch(`${GMAIL_ENDPOINT}/users/me/messages/send`, {
      method: "POST",
      headers: this.getHeaders(user.token),
      body: JSON.stringify({ raw }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Envoi échoué (${res.status}): ${text}`);
    }
  }

  async getMails(user: User, page: number = 1): Promise<Mail[]> {
    const pageNum = Number(page);
    const validPage = Number.isInteger(pageNum) && pageNum > 0 ? pageNum : 1;

    const maxResults = 10;
    let pageToken: string | undefined;

    for (let current = 1; current <= validPage; current++) {
      const url = new URL(`${GMAIL_ENDPOINT}/users/me/messages`);
      url.searchParams.set("maxResults", String(maxResults));
      if (pageToken) url.searchParams.set("pageToken", pageToken);

      const listRes = await fetch(url.toString(), {
        headers: this.getHeaders(user.token),
      });
      if (!listRes.ok) {
        const text = await listRes.text();
        throw new Error(
          `Lecture des mails échouée (${listRes.status}): ${text}`
        );
      }
      const listJson = await listRes.json();

      if (current === validPage) {
        const msgs = listJson.messages ?? [];
        const mails: Mail[] = [];

        for (const m of msgs) {
          const msgRes = await fetch(
            `${GMAIL_ENDPOINT}/users/me/messages/${m.id}?format=full`,
            { headers: this.getHeaders(user.token) }
          );
          if (!msgRes.ok) {
            const text = await msgRes.text();
            throw new Error(
              `Lecture du mail ${m.id} échouée (${msgRes.status}): ${text}`
            );
          }
          const msg = await msgRes.json();

          const headers: Record<string, string> = {};
          for (const h of msg.payload.headers) {
            headers[h.name.toLowerCase()] = h.value;
          }

          let body = msg.payload.body?.data || "";
          if (msg.payload.parts) {
            const part = msg.payload.parts.find(
              (p: any) => p.mimeType === "text/plain"
            );
            if (part) body = part.body.data;
          }

          const decodedBody = body
            ? decodeURIComponent(
                atob(body.replace(/-/g, "+").replace(/_/g, "/"))
                  .split("")
                  .map(
                    (c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                  )
                  .join("")
              )
            : "";

          mails.push({
            id: msg.id,
            subject: headers["subject"] ?? "",
            sender: headers["from"] ?? "",
            body: decodedBody,
            date: new Date(headers["date"] ?? ""),
          });
        }

        return mails;
      }

      pageToken = listJson.nextPageToken;
      if (!pageToken) {
        return [];
      }
    }

    return [];
  }

  async getMail(user: User, id: string): Promise<Mail> {
    const res = await fetch(
      `${GMAIL_ENDPOINT}/users/me/messages/${id}?format=full`,
      { headers: this.getHeaders(user.token) }
    );
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Lecture du mail ${id} échouée (${res.status}): ${text}`);
    }
    const msg = await res.json();

    const headers: Record<string, string> = {};
    for (const h of msg.payload.headers) {
      headers[h.name.toLowerCase()] = h.value;
    }

    let body = msg.payload.body?.data || "";
    if (msg.payload.parts) {
      const part = msg.payload.parts.find(
        (p: any) => p.mimeType === "text/plain"
      );
      if (part) body = part.body.data;
    }
    const decodedBody = body
      ? decodeURIComponent(
          atob(body.replace(/-/g, "+").replace(/_/g, "/"))
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        )
      : "";

    return {
      id: msg.id,
      subject: headers["subject"] ?? "",
      sender: headers["from"] ?? "",
      body: decodedBody,
      date: new Date(headers["date"] ?? ""),
    };
  }

  async deleteMail(user: User, id: string): Promise<void> {
    const res = await fetch(`${GMAIL_ENDPOINT}/users/me/messages/${id}`, {
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

export const googleMailService = new GoogleMailService();
