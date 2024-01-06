import { PutObjectCommand } from "@aws-sdk/client-s3";
import { awsClient } from "@/lib/amazonClient";
import { NextRequest, NextResponse } from "next/server";
import { capitalizeFirstLetter } from "@/utils/capitalizeFirstLetter";
import { createElementS3Key } from "@/utils/amzS3/createElementS3Key";
import { Object } from "@/types/structs/object.enum";
import { getObjectId } from "@/utils/getObjectId";
import axios from "axios";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const fileData = data.get("mediaFile") as File;
    const restaurantId = data.get("restaurantId") as string;
    const viewUrl = data.get("viewUrl") as string;
    const objectType = data.get("objectType") as Object;
    const objectId = getObjectId(data, objectType);

    const buffer = Buffer.from(await fileData.arrayBuffer());

    const objectMediaType = capitalizeFirstLetter(fileData.type.split("/")[0]);
    const extension = "." + fileData.name.split(".").pop();

    const objectKey = createElementS3Key(
      restaurantId,
      viewUrl,
      objectMediaType,
      objectId,
      extension
    );

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
          success: false,
        },
        { status: creationStatusCode }
      );

    const objectCDNUrl = process.env.CDN_DOMAIN + "/" + objectKey;
    const domain = process.env.DOMAIN;

    let editedObject;
    if (objectType === Object.ELEMENT) {
      const elementMediaKey =
        objectMediaType === "Image" ? "image_link" : "video_link";
      const editObject = {
        id: objectId,
        [elementMediaKey]: objectCDNUrl,
      };
      const elementMediaEditResponse = await axios.post(
        domain + "/api/elements/edit",
        editObject
      );

      if (elementMediaEditResponse.status !== 200)
        throw new Error("Could not update element media link");

      editedObject = elementMediaEditResponse.data.element;
    } else if (objectType === Object.RESTAURANT) {
    } else if (objectType === Object.VIEW) {
    }

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
