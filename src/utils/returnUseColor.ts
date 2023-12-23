import { ColorUse } from "@/types/structs/colorUse";

export function returnUseColor(colorUse: ColorUse) {
  switch (colorUse) {
    case ColorUse.MAIN:
      return "#74d25e";
    case ColorUse.SECONDARY:
      return "#0a9bac";
    case ColorUse.TEXT:
      return "#FFFFFF";
    default:
      console.log("No color suported for use");
      return "#000000";
  }
}
