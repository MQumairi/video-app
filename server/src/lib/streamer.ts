import fs, { ReadStream } from "fs";

export class Streamer {
  chunk_size = 50 ** 6;
  video_path: string;
  video_size: number;
  start_ts: number;
  end_ts: number;
  duration_ts: number;

  constructor(video_path: string, range: string) {
    this.video_path = video_path;
    this.video_size = Streamer.get_video_size(video_path);
    const processed_range = Streamer.process_range(range);
    this.start_ts = Number(processed_range[0]);
    if (Number(processed_range[1]) > this.start_ts) {
      this.end_ts = Number(processed_range[1]);
    } else {
      this.end_ts = Math.min(this.start_ts + this.chunk_size, this.video_size - 1);
    }
    this.duration_ts = this.end_ts - this.start_ts + 1;
  }

  get_header(): any {
    return {
      "Content-Range": `bytes ${this.start_ts}-${this.end_ts}/${this.video_size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": this.duration_ts,
      "Content-Type": "video/mp4",
    };
  }

  static process_range(range: string): string[] {
    return range.split("bytes=")[1].split("-");
  }

  static get_video_size(video_path: string): number {
    return fs.statSync(video_path).size;
  }

  create_stream(): ReadStream {
    return fs.createReadStream(this.video_path, { start: this.start_ts, end: this.end_ts });
  }
}
