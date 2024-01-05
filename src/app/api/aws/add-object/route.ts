import { PutObjectCommand } from "@aws-sdk/client-s3";
import { awsClient } from "@/lib/amazonClient";
import { NextRequest, NextResponse } from "next/server";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const fileData = data.get("media") as File;
    const restaurantId = data.get("restaurantId") as string;
    const viewUrl = data.get("viewUrl") as string;

    const mediaType = fileData.type.split("/")[0];

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let objectType = capitalizeFirstLetter(mediaType);
    const extension = "." + fileData.name.split(".").pop();

    const objectKey = `${restaurantId}/${viewUrl}/${objectType}${extension}`;

    const input = {
      Body: buffer,
      Bucket: "customer-view",
      Key: objectKey,
      ContentType: fileData.type,
    };

    const command = new PutObjectCommand(input);
    const creationResponse = await awsClient.send(command);

    const creationStatusCode = creationResponse.$metadata.httpStatusCode;
    if (creationStatusCode > 299)
      return NextResponse.json(
        {
          message:
            objectType + " upload failed with status: " + creationStatusCode,
          objectCDNUrl: "",
        },
        { status: creationStatusCode }
      );

    return NextResponse.json(
      {
        message: objectType + " added successfully!",
        objectCDNUrl: process.env.CDN_DOMAIN + "/" + objectKey,
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
