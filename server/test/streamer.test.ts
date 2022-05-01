import { Streamer } from "../src/models/streamer";

const sample_streamer = new Streamer("test/data/dir_1/vid.mov", "bytes=0-386253");

export const sample_streamer_header = {
  "Content-Range": "bytes 0-386253/386254",
  "Accept-Ranges": "bytes",
  "Content-Length": 386254,
  "Content-Type": "video/mp4",
};

test("streamer start and end bytes is correct", () => {
  expect(sample_streamer.start_ts).toBe(0);
  expect(sample_streamer.end_ts).toBe(386253);
});

test("streamer headers are correct", () => {
  expect(sample_streamer.get_header()).toMatchObject(sample_streamer_header);
});

test("gets video size", () => {
  expect(Streamer.get_video_size("test/data/dir_1/vid.mov")).toBe(386254);
});
