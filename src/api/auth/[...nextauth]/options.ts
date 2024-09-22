import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbconnect";
import userModel from "@/model/user";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentails",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },

                async authorize(credentials: any): Promise<any> {
                    await dbConnect();
                    try {
                        const user = await userModel.findOne({
                            $or: [
                                { email: credentials.identifier },
                                { username: credentials.identifier },
                            ],
                        });

                        if (!user) {
                            throw new Error("no user found please signup");
                        }

                        if (!user.isVerified) {
                            throw new Error("user not verified");
                        }

                        const isPasswordCorrect = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );

                        if (isPasswordCorrect) {
                            return user;
                        } else {
                            throw new Error("wrong password");
                        }
                    } catch (error: any) {
                        throw new Error(error);
                    }
                },
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString(); // Convert ObjectId to string
                token.isVerified = user.isVerified;
                token.isAcceptingMessages = user.isAcceptingMessages;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id;
                session.user.isVerified = token.isVerified;
                session.user.isAcceptingMessages = token.isAcceptingMessages;
                session.user.username = token.username;
            }
            return session;
        },
    },
    pages: {
        signIn: "/signin",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
