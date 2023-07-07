import { observer } from "mobx-react-lite";
import { server_url } from "../../../api/agent";
import { Chip, IconButton, Modal, Stack } from "@mui/material";
import { PathConverter } from "../../../util/path_converter";
import IImageMeta from "../../../models/image_meta";
import { ArrowBack, ArrowForward, Favorite, FavoriteBorder, Info } from "@mui/icons-material";
import { useState } from "react";
import { seconds_to_duration } from "../../../lib/video_file_meta_calculator";
import { useSearchParams } from "react-router-dom";

interface IProps {
  open_modal: boolean;
  handle_close: () => void;
  handle_thumb_set: () => Promise<void>;
  gallery_id: number;
  image: IImageMeta;
  is_thumb: boolean;
  next: () => void;
  back: () => void;
}

const GalleryModal = (props: IProps) => {
  const base_opacity = 0.1;
  const [show_info, set_show_info] = useState<boolean>(false);
  const [opacity, set_opacity] = useState<number>(base_opacity);
  const [search_params] = useSearchParams({});

  return (
    <Modal open={props.open_modal} onClose={props.handle_close} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <div
        style={{
          width: "80%",
          height: "80%",
          overflow: "hidden",
          margin: "auto",
          marginTop: "5%",
          backgroundColor: "black",
          backgroundImage: `url("${server_url}/${PathConverter.remove_base(props.image.path)}")`,
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
        onMouseEnter={() => {
          set_opacity(1);
        }}
        onMouseLeave={() => {
          set_opacity(base_opacity);
        }}
      >
        <Stack direction="row" spacing={1} style={{ opacity: opacity }}>
          <IconButton color="primary" aria-label="upload picture" component="label" onClick={props.handle_thumb_set}>
            {props.is_thumb && <Favorite />}
            {!props.is_thumb && <FavoriteBorder />}
          </IconButton>

          <IconButton color="primary" aria-label="upload picture" component="label" onClick={props.back}>
            <ArrowBack />
          </IconButton>

          <IconButton color="primary" aria-label="upload picture" component="label" onClick={props.next}>
            <ArrowForward />
          </IconButton>

          <IconButton color="primary" aria-label="upload picture" component="label">
            <Info onClick={() => set_show_info(!show_info)} />
          </IconButton>
          {show_info && (
            <div style={{ display: "flex", marginTop: "5px", gap: "10px" }}>
              <Chip label={`id: ${props.image.id}`} color="primary" variant="outlined" />
              <Chip label={`${props.image.width} x ${props.image.height}`} color="primary" variant="outlined" />
              {props.image.timestamp_secs && <Chip label={`${seconds_to_duration(props.image.timestamp_secs)}`} color="primary" variant="outlined" />}
              <a href={`/galleries/${props.gallery_id}/image/${props.image.id}?${search_params.toString()}`}>
                <Chip label={"Delete"} color="error" variant="outlined" />
              </a>
            </div>
          )}
        </Stack>
      </div>
    </Modal>
  );
};

export default observer(GalleryModal);
