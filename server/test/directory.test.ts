import { Directory } from "../src/models/directory";
import { VideoMeta } from "../src/models/video_meta";

let root_directory = new Directory("./data");
let dir_1 = new Directory("./data/dir_1");
let dir_2 = new Directory("./data/dir_2");
let sub_dir = new Directory("./data/dir_1/sub_dir");

export const root_dir_object = {
  path: "data",
  video_paths: [
    { name: "vid.mov", path: "data/vid.mov" },
    { name: "vid.mp4", path: "data/vid.mp4" },
  ],
  directory_paths: ["data/dir_1", "data/dir_2"],
};

export const dir_1_object = {
  path: "data/dir_1",
  video_paths: [
    { name: "vid.mov", path: "data/dir_1/vid.mov" },
    { name: "vid.mp4", path: "data/dir_1/vid.mp4" },
  ],
  directory_paths: ["data/dir_1/sub_dir"],
};

export const sub_dir_object = {
  path: "data/dir_1/sub_dir",
  video_paths: [],
  directory_paths: [],
};

test("path is correct", () => {
  expect(root_directory.path).toBe("data");
  expect(dir_1.path).toBe("data/dir_1");
  let root_directory_2 = new Directory("data");
  expect(root_directory_2.path).toBe("data");
});

test("parent path is correct", () => {
  expect(root_directory.parent_path).toBe("data");
  expect(dir_1.parent_path).toBe("./data");
  expect(sub_dir.parent_path).toBe("./data/dir_1");
});

test("can list sub directories", async () => {
  let root_sub_dir_1 = "data/dir_1";
  let root_sub_dir_2 = "data/dir_2";
  let root_sub_dirs = [root_sub_dir_1, root_sub_dir_2];
  expect(await root_directory.list_directory_paths()).toStrictEqual(root_sub_dirs);
  let dir_1_sub_dir = "data/dir_1/sub_dir";
  let dir_1_sub_dirs = [dir_1_sub_dir];
  expect(await dir_1.list_directory_paths()).toStrictEqual(dir_1_sub_dirs);
  let dir_2_sub_dirs: string[] = [];
  expect(await dir_2.list_directory_paths()).toStrictEqual(dir_2_sub_dirs);
});

test("can list vidoes", async () => {
  let root_vid_1 = new VideoMeta("data/vid.mov");
  let root_vid_2 = new VideoMeta("data/vid.mp4");
  let root_vids = [root_vid_1, root_vid_2];
  expect(await root_directory.list_video_paths()).toStrictEqual(root_vids);
  let dir_1_vid_1 = new VideoMeta("data/dir_1/vid.mov");
  let dir_1_vid_2 = new VideoMeta("data/dir_1/vid.mp4");
  let dir_1_vids = [dir_1_vid_1, dir_1_vid_2];
  expect(await dir_1.list_video_paths()).toStrictEqual(dir_1_vids);
  let dir_2_vids: VideoMeta[] = [];
  expect(await dir_2.list_video_paths()).toStrictEqual(dir_2_vids);
});

test("can check that file is a directory", async () => {
  let dir_path = "./data/dir_1";
  let vid_path = "./data/vid.mp4";
  expect(await Directory.is_directory(dir_path)).toBe(true);
  expect(await Directory.is_directory(vid_path)).toBe(false);
});

test("can check that file is a video", () => {
  let dir_path = "./data/dir_1";
  let mp4_path = "./data/vid.mp4";
  let mov_path = "./data/vid.mov";
  expect(Directory.is_video(dir_path)).toBe(false);
  expect(Directory.is_video(mp4_path)).toBe(true);
  expect(Directory.is_video(mov_path)).toBe(true);
});

test("can find parent", () => {
  expect(root_directory.get_parent_dir()).toBe(".");
  expect(dir_1.get_parent_dir()).toBe("data");
  expect(dir_2.get_parent_dir()).toBe("data");
  expect(sub_dir.get_parent_dir()).toBe("data/dir_1");
});

test("can build directory from path", async () => {
  expect(await Directory.from_path("data")).toMatchObject(root_dir_object);
  expect(await Directory.from_path("data/dir_1")).toMatchObject(dir_1_object);
  expect(await Directory.from_path("data/dir_1/sub_dir")).toMatchObject(sub_dir_object);
});
