import { VideoMeta } from "../src/models/video_meta";

let video_meta = VideoMeta.create_from_path("test/data/dir_1/vid.mov");

test("can build VideoMeta from path", () => {
  expect(video_meta.name).toBe("vid.mov");
  expect(video_meta.path).toBe("test/data/dir_1/vid.mov");
});
