import * as Minio from 'minio';

let minioClient: Minio.Client | null = null;
const bucket = process.env.MINIO_BUCKET!;

function getMinioClient(): Minio.Client  {
  if (!minioClient) {
    minioClient = new Minio.Client({
      endPoint: process.env.MINIO_ENDPOINT || 'localhost',
      port: Number(process.env.MINIO_PORT) || 9000,
      useSSL: (process.env.MINIO_USE_SSL === "true") || false,
      accessKey: process.env.MINIO_ACCESS_KEY || 'Sir please do not redeem the key.',
      secretKey: process.env.MINIO_SECRET_KEY || 'I said do not redeem it!',
    });
  }
  return minioClient;
};

export { getMinioClient, bucket};