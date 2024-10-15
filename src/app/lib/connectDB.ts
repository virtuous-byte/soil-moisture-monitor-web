import mongoose from "mongoose";

const DATABASE_URL = process.env.DATABASE_URL!

const cached: { connection?: typeof mongoose; promise?: Promise<typeof mongoose> } = {};

async function connectDB() {
    if (cached.connection) {
        return cached.connection;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false
        };
        cached.promise = mongoose.connect(DATABASE_URL, opts);
    }

    try {
        cached.connection = await cached.promise;
    } catch(e) {
        cached.promise = undefined;
        throw e;
    }
    return cached.connection;
}

export default connectDB;