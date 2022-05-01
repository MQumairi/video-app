import ITag from "./tag";

export default interface IVideoMeta {
  name: string;
  path: string;
  parent_path: string;
  tags?: ITag[];
}
