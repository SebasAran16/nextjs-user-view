import { Object } from "@/types/structs/object.enum";
import ElementTypes from "../elementsStruct";
import { getKeyFromCDNUrl } from "./getKeyFromCDNUrl";

export function getS3ObjectKeyFromObject(object: any, objectType: Object) {
  switch (objectType) {
    case Object.ELEMENT:
      if (object.type === ElementTypes.VIDEO) {
        return getKeyFromCDNUrl(object.video_link);
      } else if (object.type === ElementTypes.IMAGE) {
        return getKeyFromCDNUrl(object.image_link);
      }
    case Object.RESTAURANT:
    case Object.VIEW:
      return getKeyFromCDNUrl(object.image);
    default:
      throw new Error("Object type not acceped or undefined");
  }
}
