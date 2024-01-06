import { PutObjectCommand } from "@aws-sdk/client-s3";
import { awsClient } from "@/lib/amazonClient";
import { NextRequest, NextResponse } from "next/server";
import { Object } from "@/types/structs/object.enum";
import axios from "axios";
import { getElementMediaKey } from "@/utils/amzS3/getElementMediaKey";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();

    const fileData = data.get("mediaFile") as File;
    const objectType = data.get("objectType") as Object;
    const objectId = data.get("objectId") as string;
    const objectKey = data.get("objectKey") as string;

    const buffer = Buffer.from(await fileData.arrayBuffer());
    const objectMediaType = fileData.type.split("/")[0];

    const input = {
      Body: buffer,
      Bucket: process.env.CUSTOMER_VIEW_BUCKET,
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
          success: false,
        },
        { status: creationStatusCode }
      );

    const objectCDNUrl = process.env.CDN_DOMAIN + "/" + objectKey;
    const domain = process.env.DOMAIN;

    let editedObject;
    const elementMediaKey = getElementMediaKey(
      objectType,
      objectMediaType.toLowerCase()
    );
    const editObject = {
      id: objectId,
      [elementMediaKey]: objectCDNUrl,
    };

    const elementMediaEditResponse = await axios.post(
      domain + "/api/" + objectType + "s" + "/edit",
      editObject
    );

    if (elementMediaEditResponse.status !== 200)
      throw new Error("Could not update element media link");

    editedObject = elementMediaEditResponse.data[objectType];

    return NextResponse.json(
      {
        message: objectType + " added successfully!",
        object: editedObject,
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
