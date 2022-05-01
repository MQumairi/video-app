export class PathConverter {
  static to_query(path_: string): string {
    return path_.replaceAll("/", "%2F");
  }
}
