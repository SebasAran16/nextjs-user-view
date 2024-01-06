import { Object } from "@/types/structs/object.enum";
import axios from "axios";

export async function deleteAmazonObject(objectKey: string) {
  try {
    // TODO When storing data not being from elements, define the buket

    const deleteObjectResponse = await axios.post("/api/aws/delete-object", {
      objectKey,
    });

    if (deleteObjectResponse.status !== 200)
      throw new Error(deleteObjectResponse.data.message);

    return { success: true };
  } catch (err: any) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      return { errorMessage: err.response?.data.message, success: false };
    } else {
      return { errorMessage: "Could not upload media", success: false };
    }
  }
}
