import { z } from "zod";

export const usernameValidation = z
    .string()
    .min(2, "Username must be min 2 chars")
    .max(20, "username max 20 chars")
    .regex(/^[a-zA-Z0-9]+$/, { message: "Username must be alphanumeric" });

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({ message: "Email Invalid" }),
    password: z
        .string()
        .min(6, { message: "password must be min 6 characters" }),
});
