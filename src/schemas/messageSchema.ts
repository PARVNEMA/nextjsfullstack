import { z } from "zod";

export const messageSchema = z.object({
    content: z
        .string()
        .min(10, { message: "content must be minimum 10 words" })
        .max(300, { message: "content must be maximum 300 words" }),
});
