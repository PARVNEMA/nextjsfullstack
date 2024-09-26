import mongoose from "mongoose";

type Connectionbject = {
    isConnected?: number;
};

const connection: Connectionbject = {};

export async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("DB connected Already");
        return;
    }
    try {
        const db = await mongoose.connect(process.env.MONGO_URI || " ");

        const isConnected = db.connections[0].readyState;
        // console.log("db=", db);
        // console.log("db.connections=", db.connections);

        console.log("db connected successfully");
    } catch (error) {
        console.log("error in connection db", error);
        process.exit(1);
    }
}
