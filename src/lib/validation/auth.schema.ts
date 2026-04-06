import { z } from "zod";

export const adminSignupSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .startsWith("+251", "Phone number must start with +251"),
  full_name: z.string().min(1, "Full name is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  admin_unit_id: z.string().min(1, "Admin Unit ID is required"),
});

export type AdminSignupValues = z.infer<typeof adminSignupSchema>;
