import { z } from "zod";

export const patientSchema = z.object({
  firstName: z.string().trim().min(1, "First Name is required"),
  lastName: z.string().trim().min(1, "Last Name is required"),
  age: z.coerce.number().min(0, "Age is required"),
  gender: z.enum(["Male", "Female", "Other"], {
    required_error: "Gender is required",
    invalid_type_error: "Invalid gender selected",
  }),
  contactNumber: z
    .string()
    .trim()
    .min(10, "Contact number is required")
    .max(10, "Contact number must be 10 digits")
    .regex(/^\d{10}$/, { message: "Contact number must be 10 digits" }),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  bloodGroup: z.string().optional().or(z.literal("")),
  medicalConditions: z.string().optional().or(z.literal("")),
});

export type TPatientForm = z.infer<typeof patientSchema>;
