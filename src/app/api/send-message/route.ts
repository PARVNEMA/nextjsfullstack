import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/user";

import { Message } from "@/model/user";

export async function POST(request: Request) {
    await dbConnect();

    const { username, content } = await request.json();

    try {
        const user = await userModel.findOne({ username });

        if (!user) {
            return Response.json(
                {
                    success: false,
                    message: "user not found",
                },
                { status: 400 }
            );
        }

        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "user not accepting messages",
                },
                { status: 400 }
            );
        }

        const newMessage = { content, createdAt: new Date() };

        user.message.push(newMessage as Message);

        await user.save();
        return Response.json(
            {
                success: true,
                message: "message sent successfully",
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error in sending message",
            },
            { status: 500 }
        );
    }
}
