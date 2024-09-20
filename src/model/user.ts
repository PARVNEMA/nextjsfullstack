import mongoose, { Schema, Document } from "mongoose";

export interface Message extends Document {
    content: string;
    createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    message: Message[];
}

const userSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "username required"],
        trim: true,
        unique: true,
    },
    email: {
        type: String,
        required: [true, "email required"],
        unique: true,
        match: [
            /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
            "please use a valid email address",
        ],
    },
    password: {
        type: String,
        required: [true, "password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "verifyCode is required"],
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verifyCodeExpiry is required"],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true,
    },
    message: [MessageSchema],
});

const userModel =
    (mongoose.models.User as mongoose.Model<User>) ||
    mongoose.model<User>("User", userSchema);
export default userModel;