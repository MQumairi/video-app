export const VideoTags = (props: any) => {
  return (
    <div>
      <h1>
        {props.tags?.map((tag: any) => {
          return <div>{tag.name}</div>;
        })}
      </h1>
    </div>
  );
};
