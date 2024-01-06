import { Object } from "@/types/structs/object.enum";

export function getObjectId(formData: FormData, objectType: Object): string {
  switch (objectType) {
    case Object.ELEMENT:
      return formData.get("elementId") as string;
    case Object.RESTAURANT:
      return formData.get("restaurantId") as string;
    case Object.VIEW:
      return formData.get("viewId") as string;
    default:
      throw new Error("Object type not expected");
  }
}
