import axios from "axios";

export async function editAmzObject(formData: FormData) {
  try {
    const objectUploadResponse = await axios.post(
      "/api/aws/edit-object",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    if (objectUploadResponse.status !== 200)
      throw new Error(objectUploadResponse.data.message);

    const objectCDNUrl = objectUploadResponse.data.objectCDNUrl;
    return { objectCDNUrl, success: true };
  } catch (err) {
    console.log(err);
    if (axios.isAxiosError(err)) {
      return { errorMessage: err.response?.data.message, success: false };
    } else {
      return { errorMessage: "Could not upload media", success: false };
    }
  }
}
