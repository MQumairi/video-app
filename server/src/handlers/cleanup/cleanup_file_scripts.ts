import { Request, Response } from "express";
import LibraryIterator from "../../lib/library_iterator";
import { FileScript } from "../../models/file_script";

const create_script = async (script: FileScript) => {
  console.log("find_or_create script:", script);
  await FileScript.find_or_create(script);
};

const CleanupFileScripts = async (req: Request, res: Response): Promise<void> => {
  console.log("Cleaning up file scripts");
  await LibraryIterator.iterate_scripts(create_script);
  console.log("Done file script cleanup");
};

export default CleanupFileScripts;
