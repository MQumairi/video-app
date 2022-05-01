import { VideoMeta } from "../models/video_meta";

let video_meta = new VideoMeta("data/dir_1/vid.mov");

test("can build VideoMeta from path", () => {
  expect(video_meta.name).toBe("vid.mov");
  expect(video_meta.path).toBe("data/dir_1/vid.mov");
});
