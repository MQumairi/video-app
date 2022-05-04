export class PathConverter {
  static to_query(path_: string): string {
    return path_.replaceAll("/", "%2F");
  }

  static get_base_name(file: string): string {
    let split_arr = file.split("/");
    let base_file = split_arr.pop();
    return base_file ?? "";
  }
}
