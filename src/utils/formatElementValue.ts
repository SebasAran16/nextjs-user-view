import getTypeFromNumber from "./getTypeFromNumber";

export function formatElementValue(key: string, value: any) {
  try {
    switch (key) {
      case "view_id":
      case "name":
      case "text":
      case "position":
      case "video_link":
      case "button_link":
      case "image_link":
        return value;
      case "type":
        return getTypeFromNumber(value);
      case "created_at":
        const date = new Date(value);
        return date.toLocaleDateString();
    }
  } catch (err) {
    console.log(err);
    return;
  }
}
