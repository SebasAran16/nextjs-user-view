export default function getTypeFromNumber(type: number) {
  switch (type) {
    case 1:
      return "Text";
    case 2:
      return "Video";
    case 3:
      return "Image";
    case 4:
      return "Button Link";
    case 5:
      return "Links Group";
    default:
      return "Type not supported";
  }
}
