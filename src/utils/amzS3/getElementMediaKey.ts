import { Object } from "@/types/structs/object.enum";

export function getElementMediaKey(
  objectType: Object,
  objectMediaType: string
) {
  switch (objectType) {
    case Object.ELEMENT:
      const elementMediaKey =
        objectMediaType === "image" ? "image_link" : "video_link";
      return elementMediaKey;
    case Object.RESTAURANT:
    case Object.VIEW:
      return objectMediaType;
    default:
      throw new Error("Object type not supported!");
  }
}
