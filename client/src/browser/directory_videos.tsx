import { PathConverter } from "../util/path_converter";

export const DirectoryVideos = (props: any) => {
  return (
    <div>
      {props.video_paths.map((vid: any) => {
        return (
          <div key={vid.name}>
            <a href={`/player/${PathConverter.to_query(vid.path)}`}>{vid.name} </a>
          </div>
        );
      })}
    </div>
  );
};
