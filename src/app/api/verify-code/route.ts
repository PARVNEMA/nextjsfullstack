import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/user";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, code } = await request.json();

        const decodeusername = decodeURIComponent(username);

        const user = await userModel.findOne({ username: decodeusername });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found",
                },
                { status: 500 }
            );
        }

        const iscodevalid = user.verifyCode === code;

        const iscodenotexpired = new Date(user.verifyCodeExpiry) > new Date();

        if (iscodevalid && iscodenotexpired) {
            user.isVerified = true;
            await user.save();
            return Response.json(
                {
                    success: true,
                    message: "account verified successfully",
                },
                { status: 200 }
            );
        } else if (!iscodenotexpired) {
            return Response.json(
                {
                    success: false,
                    message: "code has been expired",
                },
                { status: 400 }
            );
        } else {
            return Response.json(
                {
                    success: false,
                    message: "Incorrect code",
                },
                { status: 400 }
            );
        }
    } catch (error) {
        console.log("error in verifying user", error);
        return Response.json(
            {
                success: false,
                message: "error in verifying user",
            },
            { status: 500 }
        );
    }
}
