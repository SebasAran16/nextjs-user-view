import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { awsClient } from "@/lib/amazonClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { objectKey } = await request.json();

    const input = {
      Bucket: process.env.CUSTOMER_VIEW_BUCKET,
      Key: objectKey,
    };

    const command = new DeleteObjectCommand(input);
    const deleteResponse = await awsClient.send(command);

    const deleteStatusCode = deleteResponse.$metadata.httpStatusCode;
    if (deleteStatusCode > 299)
      return NextResponse.json(
        {
          message: "Delete failed with status: " + deleteStatusCode,
          success: false,
        },
        { status: deleteStatusCode }
      );

    return NextResponse.json(
      {
        message: "Asset deleted successfully!",
        success: true,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.log(err);
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 }
    );
  }
}
