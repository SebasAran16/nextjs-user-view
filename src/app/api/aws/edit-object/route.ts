import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { awsClient } from "@/lib/amazonClient";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const fileData = data.get("mediaFile") as File;
    const objectKey = data.get("objectKey") as string;

    const deleteInput = {
      Bucket: process.env.CUSTOMER_VIEW_BUCKET,
      Key: objectKey,
    };

    const deleteCommand = new DeleteObjectCommand(deleteInput);
    const deleteResponse = await awsClient.send(deleteCommand);

    const deleteStatusCode = deleteResponse.$metadata.httpStatusCode;

    const buffer = Buffer.from(await fileData.arrayBuffer());

    const extension = objectKey.slice(objectKey.lastIndexOf("."));
    const nenVersionNumber =
      Number(objectKey.slice(0, objectKey.lastIndexOf(".")).slice(-1)) + 1;
    const newVersionKey =
      objectKey.slice(0, objectKey.lastIndexOf("_")) +
      "_v" +
      nenVersionNumber.toString() +
      extension;

    const input = {
      Body: buffer,
      Bucket: process.env.CUSTOMER_VIEW_BUCKET,
      Key: newVersionKey,
      ContentType: fileData.type,
    };

    const command = new PutObjectCommand(input);
    const editResponse = await awsClient.send(command);

    const editStatusCode = editResponse.$metadata.httpStatusCode;

    if (editStatusCode > 299 || deleteStatusCode > 299)
      return NextResponse.json(
        {
          message: "Media edit failed with status: " + editStatusCode,
          success: false,
        },
        { status: editStatusCode }
      );

    const objectCDNUrl = process.env.CDN_DOMAIN + "/" + newVersionKey;
    console.log(objectCDNUrl);

    return NextResponse.json(
      {
        message: "Media edited added successfully!",
        objectCDNUrl,
        success: true,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          message: err.response?.data.message,
        },
        { status: err.response?.status }
      );
    } else {
      return NextResponse.json(
        {
          success: false,
          message: err.message,
        },
        { status: 500 }
      );
    }
  }
}
