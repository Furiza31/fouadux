import type { Mail } from "@/types/mail";

export const mails: Mail[] = [
  {
    id: "1",
    subject: "Meeting Reminder",
    sender:
      "managerdapdnandpandaindandpiandpanupdunapundaundpandpan@example.com",
    body: "Don't forget about the meeting tomorrow at 10 AM. Don't forget about the meeting tomorrow at 10 AM. Don't forget about the meeting tomorrow at 10 AM. Don't forget about the meeting tomorrow at 10 AM. Don't forget about the meeting tomorrow at 10 AM.",
    date: new Date("2023-10-01T09:00:00"),
  },
  {
    id: "2",
    subject: "Project Update",
    sender: "teamlead@example.com",
    body: "Please provide an update on your project progress by EOD.",
    date: new Date("2023-10-02T14:30:00"),
  },
  {
    id: "3",
    subject: "Welcome to the Team!",
    sender: "hr@example.com",
    body: "We are excited to have you on board. Let us know if you need anything.",
    date: new Date("2023-10-03T08:00:00"),
  },
  {
    id: "4",
    subject: "Invoice Due",
    sender: "billing@example.com",
    body: "Your invoice #12345 is due on October 5th. Please make the payment.",
    date: new Date("2023-10-04T10:15:00"),
  },
  {
    id: "5",
    subject: "Weekly Newsletter",
    sender: "newsletter@example.com",
    body: "Here are the latest updates and news for this week.",
    date: new Date("2023-10-05T07:45:00"),
  },
  {
    id: "6",
    subject: "Event Invitation",
    sender: "events@example.com",
    body: "You are invited to our annual gala. RSVP by October 10th.",
    date: new Date("2023-10-07T16:00:00"),
  },
  {
    id: "7",
    subject: "System Maintenance",
    sender: "it@example.com",
    body: "Scheduled maintenance will occur on October 8th from 1 AM to 3 AM.",
    date: new Date("2023-10-08T12:00:00"),
  },
  {
    id: "8",
    subject: "Job Application Received",
    sender: "careers@example.com",
    body: "Thank you for applying. We will review your application and get back to you.",
    date: new Date("2023-10-09T09:30:00"),
  },
  {
    id: "9",
    subject: "Feedback Request",
    sender: "feedback@example.com",
    body: "We value your feedback. Please take a moment to complete our survey.",
    date: new Date("2023-10-10T15:45:00"),
  },
];
