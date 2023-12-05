import IVideoMeta from "../models/video_meta";

export const resolution_from_height = (height: number): string => {
  if (height === 2160) return "4K";
  else if (height === 0) return "Any";
  else return `${height}p`;
};

export const calculate_resolution = (video: IVideoMeta | null): string => {
  if (!video || !video.height) return "";
  return resolution_from_height(video.height);
};

export const calculate_duration = (video: IVideoMeta | null): string => {
  if (!video || !video.duration_sec) return "";
  return seconds_to_duration(video.duration_sec);
};

export const get_file_size_string = (video: IVideoMeta | null): string => {
  if (!video) return "0 MB";
  const size_mb = video.size_mb;
  if (size_mb < 1000) return `${size_mb} MB`;
  const size_gigabytes = size_mb / 1000;
  return `${size_gigabytes.toFixed(1)} GB`;
};

export const seconds_to_duration = (seconds: number): string => {
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
};
