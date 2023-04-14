import { VideoMeta } from "../../models/video_meta";
import { exec as exec_sync } from "child_process";
import { promisify } from "util";
const exec = promisify(exec_sync);

export class Timestamper {
  START_PERCENTILE = 0.2;
  END_PERCENTILE = 0.8;

  video: VideoMeta;

  private thumbnail_timestamps: string[] = [];
  private thumbnail_timestamps_secs: number[] = [];

  constructor(video: VideoMeta) {
    this.video = video;
  }

  // Given video, return duration in hh:mm:ss format
  async video_duration(): Promise<string> {
    try {
      const command = `ffmpeg -i "${this.video.path}" 2>&1 | grep "Duration"`;
      const exec_res = await exec(command);
      return exec_res.stdout.split(",")[0].slice(-11);
    } catch {
      return "";
    }
  }

  // Given video, return duration in seconds
  async video_duration_seconds(): Promise<number> {
    let duration_string = await this.video_duration();
    if (duration_string.length == 0) return 0;
    return Timestamper.duration_to_seconds(duration_string);
  }

  // Get video's current timestampes
  private get_thumb_timestamps = (): number[] => {
    const current_timestamps: number[] = [];
    if (!this.video.gallery || !this.video.gallery.images) return current_timestamps;
    for (let img of this.video.gallery.images) {
      if (img.timestamp_secs) current_timestamps.push(img.timestamp_secs);
    }
    return current_timestamps.sort();
  };

  // Given video, return n timestamps, from intervals between START_PERCENTILE to END_PERCENTILE
  async video_markers(n: number) {
    // Get video in seconds
    const duration_secs = await this.video_duration_seconds();
    // See if video already has timestamped thumbnails
    const current_timestamps = this.get_thumb_timestamps();
    // If video already has timestamps...
    if (current_timestamps.length > 0) {
      return await this.extra_video_markers(duration_secs, current_timestamps);
    }
    // Otherwise...
    return await this.new_video_markers(duration_secs, n);
  }

  async new_video_markers(video_duration: number, n: number) {
    console.log("new video markers");
    // First Marker
    const FIRST_MARKER_SECS = Math.floor(video_duration * this.START_PERCENTILE);
    // Last Marker
    const END_MARKER_SECS = Math.floor(video_duration * this.END_PERCENTILE);
    // Number of secs between two consecutive markers
    const MARKER_INTERVAL = Math.floor((END_MARKER_SECS - FIRST_MARKER_SECS) / n);
    console.log({
      first_marker: Timestamper.seconds_to_duration(FIRST_MARKER_SECS),
      last_marker: Timestamper.seconds_to_duration(END_MARKER_SECS),
      interval: Timestamper.seconds_to_duration(MARKER_INTERVAL),
    });

    for (let i = FIRST_MARKER_SECS; i < END_MARKER_SECS; i += MARKER_INTERVAL) {
      if (this.thumbnail_timestamps.length >= n) break;
      this.thumbnail_timestamps_secs.push(i);
      this.thumbnail_timestamps.push(Timestamper.seconds_to_duration(i));
    }
  }

  async extra_video_markers(video_duration: number, current_timestamps: number[]) {
    const sorted_timestams = current_timestamps.sort((a, b) => a - b);
    const min_interval = Math.max(Math.floor(video_duration / 200), 5);
    for (let i = 0; i < sorted_timestams.length - 1; i++) {
      const min_bound = i === 0 ? 0 : sorted_timestams[i];
      const max_bound = sorted_timestams[i + 1];
      const ts = Timestamper.random_int(min_bound, max_bound);
      if (ts - min_bound <= min_interval || max_bound - ts <= min_interval) continue;
      this.thumbnail_timestamps_secs.push(ts);
      this.thumbnail_timestamps.push(Timestamper.seconds_to_duration(ts));
    }
    const last_ts = Timestamper.random_int(this.thumbnail_timestamps_secs.at(-1)!, video_duration);
    this.thumbnail_timestamps_secs.push(last_ts);
    this.thumbnail_timestamps.push(Timestamper.seconds_to_duration(last_ts));
  }

  get_timestamps() {
    return this.thumbnail_timestamps;
  }

  get_timestamps_secs() {
    return this.thumbnail_timestamps_secs;
  }

  private static duration_to_seconds(duration_string: string): number {
    const [hours, minutes, seconds] = duration_string.split(":");
    const hours_secs = +hours * 60 * 60;
    const minutes_secs = +minutes * 60;
    return hours_secs + minutes_secs + Math.abs(+seconds);
  }

  private static seconds_to_duration(seconds: number): string {
    const hrs = ~~(seconds / 3600);
    const mins = ~~((seconds % 3600) / 60);
    const secs = ~~seconds % 60;
    const duration_n_arr = [hrs, mins, secs];
    const duration_s_arr = [];
    for (let d of duration_n_arr) {
      if (d < 10) {
        duration_s_arr.push(`0${d}`);
      } else {
        duration_s_arr.push(`${d}`);
      }
    }
    let duration = duration_s_arr.join(":");
    // Append random millsecond duration
    duration += `.${Math.floor(Math.random() * 1000)}`;
    return duration;
  }

  private static random_int(min: number, max: number): number {
    const diff = max - min;
    const rand = Math.random();
    const fixed = +rand.toFixed(3);
    const factor = Math.floor(fixed * diff);
    const res = +factor + +min;
    return res;
  }
}
