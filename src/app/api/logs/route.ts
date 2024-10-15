import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/app/lib/connectDB";
import Logs from "@/app/lib/models/logs";
import { z } from "zod";

const PostSchema = z.object({
    sensors: z.number().array()
})

type PostSchema = z.infer<typeof PostSchema>;

export const GET = async () => {
    try {
        await connectDB();
        const response = await Logs.find()
            .sort({ _id: -1})
            .limit(24)
            .exec();
        return NextResponse.json({
            response: response
        }, {status: 200});
    } catch(error)  {
        console.error(error);
        return NextResponse.json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        const data = await req.json();
        const result = PostSchema.parse(data);
        await connectDB();
        const response = await Logs.create(result);
        return NextResponse.json({
            response: response
        }, {
            status: 200
        });
    } catch(error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: error.errors
            }, {
                status: 400
            });
        }

        console.error(error); 
        return NextResponse.json({
            error: 'Internal Server Error'
        }, {
            status: 500
        });
    }
}