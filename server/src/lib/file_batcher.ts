import glob from "glob";

export interface BatchResult {
  successes: number;
  failures: number;
}

export class FileBatcher {
  static BATCHSIZE = 50;

  glob_patterns: string[];

  constructor(base_dir: string, extensins: string[]) {
    this.glob_patterns = extensins.map((ext) => {
      return `${base_dir}/**/*${ext}`;
    });
  }

  // Expects to receive a handler that takes an array of file paths, and returns a boolean if batch processing was successful
  execute_handler = async (handler: (file_paths: string[]) => Promise<boolean>): Promise<BatchResult> => {
    const batch_result: BatchResult = { successes: 0, failures: 0 };
    const file_paths = await glob(this.glob_patterns);
    while (file_paths.length) {
      // Process video batch
      const batch = file_paths.splice(0, FileBatcher.BATCHSIZE);
      const batch_success = await handler(batch);
      if (batch_success) {
        batch_result.successes += 1;
      } else {
        batch_result.failures += 1;
      }
    }
    return batch_result;
  };
}
