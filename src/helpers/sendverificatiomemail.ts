import { resend } from "@/lib/resend";

import VerificationEmail from "../../email/verificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: "Acme <onboarding@resend.dev>",
            to: email,
            subject: "Hello world",
            react: VerificationEmail({ username, otp: verifyCode }),
        });

        return {
            success: true,
            message: "verification email sent successfully",
        };
    } catch (error) {
        console.error("error in sending verification email", error);
        return { success: false, message: "failed to send verification email" };
    }
}
