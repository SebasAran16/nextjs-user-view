const { S3Client } = require("@aws-sdk/client-s3");

export const awsClient = new S3Client({
  credentials: {
    accessKeyId: process.env.AMZ_ACCESS_KEY,
    secretAccessKey: process.env.AMZ_SECRET_KEY,
  },
  region: "eu-west-1",
});
