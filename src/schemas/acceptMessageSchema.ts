import { z } from "zod";

export const acceptMessageSchema = z.object({
    code: z.boolean(),
});
