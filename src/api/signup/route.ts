import { sendVerificationEmail } from "@/helpers/sendverificatiomemail";
import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/user";

import bcryptjs from "bcryptjs";
import { verify } from "crypto";
import { use } from "react";

export async function POST(request: Request) {
    await dbConnect();
    try {
        const { username, email, password } = await request.json();

        const existingUser = await userModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUser) {
            return Response.json(
                {
                    successs: false,
                    message: "username is already taken",
                },
                { status: 400 }
            );
        }

        const existingUserByEmail = await userModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json(
                    {
                        successs: false,
                        message: "user is already exists with this email",
                    },
                    { status: 400 }
                );
            } else {
                const hashedPassword = await bcryptjs.hash(password, 10);

                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(
                    Date.now() + 3600000
                );

                await existingUserByEmail.save();
            }
        } else {
            const hashedPassword = await bcryptjs.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);
            const newUser = new userModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: [],
            });
            await newUser.save();

            const emailResponse = await sendVerificationEmail(
                email,
                username,
                verifyCode
            );

            if (!emailResponse.success) {
                return Response.json(
                    {
                        success: false,
                        message: emailResponse.message,
                    },
                    { status: 500 }
                );
            }
            return Response.json(
                {
                    success: true,
                    message:
                        "User registered successfully. Please verify your account.",
                },
                { status: 201 }
            );
        }
    } catch (error) {
        console.error("error in regestring user", error);
        return Response.json(
            {
                successs: false,
                message: "error in regestring user",
            },
            {
                status: 500,
            }
        );
    }
}
