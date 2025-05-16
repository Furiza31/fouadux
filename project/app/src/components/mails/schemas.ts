import { toTypedSchema } from "@vee-validate/zod";
import * as z from "zod";

export const mailFormSchema = toTypedSchema(
  z.object({
    to: z.string().email("Invalid email address"),
    subject: z.string().min(1, "Subject is required"),
    body: z.string().min(1, "Body is required"),
  })
);
