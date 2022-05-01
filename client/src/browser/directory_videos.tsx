export const DirectoryVideos = (props: any) => {
  return (
    <div>
      {props.video_paths.map((vid: any) => {
        return <div key={vid}> {vid.name} </div>;
      })}
    </div>
  );
};
