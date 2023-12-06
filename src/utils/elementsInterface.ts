import IRange from "./rangeInterface";

export default interface IElement {
  id: number;
  name: string;
  type: number;
  position: number;
  range?: IRange;
  url?: string;
  text?: string;
  image?: string;
}
