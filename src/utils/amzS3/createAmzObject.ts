import axios from "axios";

export async function createAmzObject(formData: FormData) {
  try {
    const objectUploadResponse = await axios.post(
      "/api/aws/add-object",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (objectUploadResponse.status !== 200)
      throw new Error(objectUploadResponse.data.message);

    const object = objectUploadResponse.data.object;
    return { object, success: true };
  } catch (err) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      return { errorMessage: err.response?.data.message, success: false };
    } else {
      return { errorMessage: "Could not upload media", success: false };
    }
  }
}
