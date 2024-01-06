export default interface INewElement {
  view_id: string;
  name: string;
  type: number;
  text?: string;
  media_file?: File;
  button_link?: string;
  link_group?: Object[];
  view_url?: string;
  restaurant_id?: string;
}
