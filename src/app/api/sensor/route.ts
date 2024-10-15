import { NextResponse } from "next/server";
import { z } from "zod";

const PostSchema = z.object({
    sensors: z.number().array(),
});

type PostSchema = z.infer<typeof PostSchema>;

let sensors = [0, 1, 2, 3, 4, 5];

export const GET = async () => {
    return NextResponse.json({
        sensors: sensors
    }, {
        status: 200
    });
}

export const POST = async (req: Request) => {
    const data = await req.json();
    try {
        const result = PostSchema.parse(data)
        sensors = result.sensors;
        return NextResponse.json({}, {
            status: 200
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({
                error: error.errors
            }, {
                status: 400
            });
        }
    }
}