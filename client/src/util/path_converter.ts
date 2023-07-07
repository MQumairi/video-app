export class PathConverter {
  static to_query(path_: string): string {
    return path_.replaceAll("/", "%2F");
  }

  static split_url(file: string): string[] {
    let split_arr = file.split("/");
    return split_arr;
  }

  static get_base_name(file: string): string {
    let base_file = PathConverter.split_url(file).pop();
    return base_file ?? "";
  }

  static get_parent_file(file: string): string {
    let split_arr = PathConverter.split_url(file);
    console.log("split arr is:", split_arr);
    split_arr.pop();
    return split_arr.pop() ?? "";
  }

  static remove_base(file: string): string {
    const path_array = file.split("/");
    path_array.shift();
    console.log(encodeURIComponent(path_array.join("/")));
    return encodeURIComponent(path_array.join("/"));
  }
}
