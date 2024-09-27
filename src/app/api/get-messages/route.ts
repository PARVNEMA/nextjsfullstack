import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/user";
import { getServerSession } from "next-auth";
import { User } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await userModel.aggregate([
            { $match: { id: userId } },
            { $unwind: "$messages" },
            {
                $sort: { "messages.createdAt": -1 },
            },
            {
                $group: { _id: "$_id", messages: { $push: "$messages" } },
            },
        ]);
        if (!user || user.length <= 0) {
            return Response.json(
                {
                    success: false,
                    message: "user not found",
                },
                { status: 400 }
            );
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages,
            },
            { status: 200 }
        );
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "error is getting user messages",
            },
            { status: 500 }
        );
    }
}
