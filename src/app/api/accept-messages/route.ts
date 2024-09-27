import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "user not authenticated",
            },
            { status: 500 }
        );
    }

    const userId = user._id;
    const { acceptmessages } = await request.json();

    try {
        const updated = await userModel.findByIdAndUpdate(
            userId,
            {
                isAcceptingMessage: acceptmessages,
            },
            { new: true }
        );

        if (!updated) {
            return Response.json(
                {
                    success: false,
                    message:
                        "error in toggling the user accept message status || finding the user",
                },
                { status: 400 }
            );
        }
        return Response.json(
            {
                success: true,
                message: "user toggle status changed successfully",
                updated,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error in toggling the user accept message status",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);

    const user: User = session?.user;
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "user not authenticated",
            },
            { status: 500 }
        );
    }

    const userId = user._id;

    try {
        const founduser = await userModel.findById(userId);
        if (!founduser) {
            return Response.json(
                {
                    success: false,
                    message: "user not found in getting the toggle status",
                },
                { status: 404 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "user accepting message status goted",
                isAcceptingMessage: founduser.isAcceptingMessage,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error in getting the toggling status",
            },
            { status: 500 }
        );
    }
}
