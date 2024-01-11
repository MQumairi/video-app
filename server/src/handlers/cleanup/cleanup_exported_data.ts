import { Request, Response } from "express";
import { DataExporter } from "../../lib/data_exporter";

const CleanupExportedData = async (req: Request, res: Response): Promise<void> => {
  console.log("exporting data now...");
  console.log("exporting tags...");
  await DataExporter.export_tags();
  console.log("cleaning up videos...");
  await DataExporter.export_videos();
  res.status(200).send({ message: "ok" });
};

export default CleanupExportedData;
