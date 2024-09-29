import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/user";
import { usernameValidation } from "@/schemas/signUpSchema";

import { z } from "zod";

const usernameQuerySchema = z.object({
    username: usernameValidation,
});

export async function GET(request: Request) {
    if (request.method !== "GET") {
        return Response.json(
            {
                sucess: false,
                message: "method not allowed",
            },
            { status: 405 }
        );
    }
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);

        const quesryParam = {
            username: searchParams.get("username"),
        };

        const result =
            usernameQuerySchema.safeParse(quesryParam);

        console.log(result);
        if (!result.success) {
            const usernameError =
                result.error.format().username?._errors ||
                [];

            return Response.json(
                {
                    success: false,
                    message:
                        usernameError.length > 0
                            ? usernameError.join(",")
                            : "Invalid query parameters",
                },
                { status: 400 }
            );
        }
        const { username } = result.data;
        const existedverifieduser = await userModel.findOne(
            {
                username,
                isVerified: true,
            }
        );

        if (existedverifieduser) {
            return Response.json(
                {
                    success: false,
                    message: "username is already taken",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "Username is unique",
            },
            { status: 200 }
        );
    } catch (error) {
        console.log("error in checking username", error);
        return Response.json(
            {
                success: false,
                message: "error in checking username",
            },
            { status: 500 }
        );
    }
}
