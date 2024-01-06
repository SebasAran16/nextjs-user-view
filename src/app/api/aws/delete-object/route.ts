import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { awsClient } from "@/lib/amazonClient";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { objectKey } = await request.json();

    const input = {
      Bucket: "customer-view",
      Key: objectKey,
    };

    const command = new DeleteObjectCommand(input);
    const deleteResponse = await awsClient.send(command);

    const creationStatusCode = deleteResponse.$metadata.httpStatusCode;
    if (creationStatusCode > 299)
      return NextResponse.json(
        {
          message: "Delete failed with status: " + creationStatusCode,
          success: false,
        },
        { status: creationStatusCode }
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
