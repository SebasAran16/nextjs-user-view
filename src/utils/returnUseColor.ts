import { ColorUse } from "@/types/structs/colorUse";
import {
  defaultMainColor,
  defaultSecondaryColor,
  defaultTextColor,
} from "./defaultColors";

export function getColorFromUse(colorUse: ColorUse) {
  switch (colorUse) {
    case ColorUse.MAIN:
      return defaultMainColor;
    case ColorUse.SECONDARY:
      return defaultSecondaryColor;
    case ColorUse.TEXT:
      return defaultTextColor;
    default:
      console.log("No color suported for use");
      return "#000000";
  }
}
