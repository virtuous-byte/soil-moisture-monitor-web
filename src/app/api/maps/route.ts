import { NextRequest, NextResponse } from "next/server";
import { getMinioClient, bucket } from "@/app/lib/connectMinio";
import connectDB from "@/app/lib/connectDB";
import Maps from "@/app/lib/models/maps";
import { v4 as uuidv4 } from 'uuid';
import dayjs from "dayjs";

export const GET = async () => {
    try {
        await connectDB();
        const response = await Maps.findOne()
            .sort({ _id: -1})
            .exec();
        
        const minio = getMinioClient();
        const chunks: Buffer[] = [];
        const dataStream = await minio.getObject(bucket, response.fileName);

        await new Promise<void>((resolve, reject) => {
            dataStream.on('data', (chunk) => {
                chunks.push(chunk);
            })

            dataStream.on('end', () => resolve());
            dataStream.on('error', (err) => reject(err));
        })

        const buffer = Buffer.concat(chunks);
        const base64Image = buffer.toString('base64');
        return NextResponse.json({
            image: base64Image,
            time: dayjs(response.createdAt).format('YYYY-MM-DD HH:mm')
        }, {
            status: 200
        });
    } catch(error) {
        console.error(error);
        return NextResponse.json({
            error: error
        }, {
            status: 500
        });
    }
}

export const POST = async (req: NextRequest) => {
    try {
        await connectDB();
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
          }

        const minio = getMinioClient();
        const fileName = `${uuidv4()}.png`;
        
        const buffer = Buffer.from(await file.arrayBuffer());
        const bufferSize = buffer.length;

        const minioResponse = await minio.putObject(bucket, fileName, buffer, bufferSize, {
            'Content-Type': file.type
        });

        const dbResponse = await Maps.create({
            fileName: fileName,
            etag: minioResponse.etag
        });

        return NextResponse.json({
            response: dbResponse
        }, {
            status: 200
        });
    } catch(error) {
        console.error('Error handling map image upload:', error);
        return NextResponse.json({
            error: 'Error handling map image upload.'
        }, {
            status: 500
        });
    }
}