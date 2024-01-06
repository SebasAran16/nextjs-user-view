import { Object } from "@/types/structs/object.enum";
import { createElementS3Key } from "./createElementS3Key";

export function getS3APIDataFromFormData(formData: FormData) {
  const mediaFile = formData.get("mediaFile") as File;
  const objectType = formData.get("objectType") as string;
  const objectId = formData.get("objectId") as string;

  const extension = "." + mediaFile.name.split(".").pop();
  let restaurantId, viewUrl;

  switch (objectType) {
    case Object.RESTAURANT:
      const restaurantObjectKey = objectId + "/logo_v1" + extension;
      formData.append("objectKey", restaurantObjectKey);
      return formData;
    case Object.VIEW:
      restaurantId = formData.get("restaurantId") as string;
      viewUrl = formData.get("viewUrl") as string;
      formData.delete("restaurantId");
      formData.delete("viewUrl");

      const viewObjectKey = `${restaurantId}/${viewUrl}/logo_v1${extension}`;
      formData.append("objectKey", viewObjectKey);

      return formData;
    case Object.ELEMENT:
      restaurantId = formData.get("restaurantId") as string;
      viewUrl = formData.get("viewUrl") as string;
      formData.delete("restaurantId");
      formData.delete("viewUrl");

      const objectMediaType = mediaFile.type.split("/")[0];
      const elementObjectKey = createElementS3Key(
        restaurantId,
        viewUrl,
        objectMediaType,
        objectId,
        extension
      );
      formData.append("objectKey", elementObjectKey);

      return formData;
    default:
      throw new Error("Object type not valid!");
  }
}
