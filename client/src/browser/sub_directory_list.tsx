export const SubDirectoryList = (props: any) => {
  return (
    <div>
      {props.directory_paths.map((dir: string) => {
        return (
          <div
            key={dir}
            onClick={() => {
              console.log("clicked on", dir);
              props.fetch_directory(dir);
            }}
          >
            {dir}
          </div>
        );
      })}
    </div>
  );
};
