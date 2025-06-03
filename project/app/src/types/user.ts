export type User = {
  id: number;
  email: string;
  token: string;
  uuid: string;
  provider: "microsoft" | "google";
};
