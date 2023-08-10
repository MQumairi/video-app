import { observer } from "mobx-react-lite";
import IPersistentQuery from "../../../models/persistent_query";
import { Accordion, AccordionDetails, AccordionSummary, Button, ButtonGroup, FormGroup, Typography } from "@mui/material";
import { ExpandMore, PlayArrow } from "@mui/icons-material";
import TagsList from "../util/tags_list";

interface IProps {
  query: IPersistentQuery;
  tag_id: number;
  order: number;
}

const DynamicPlaylistQueryItem = (props: IProps) => {
  const accordion_style = {
    width: "100%",
    margin: "5px",
    borderRadius: "10px",
  };

  return (
    <div key={props.query.id} style={accordion_style}>
      <Accordion sx={{ backgroundColor: "#032a40" }}>
        <AccordionSummary expandIcon={<ExpandMore />} aria-controls="panel1a-content" id="panel1a-header">
          <FormGroup row>
            <Typography>{props.query.name}</Typography>
          </FormGroup>
        </AccordionSummary>
        <AccordionDetails>
          <ButtonGroup sx={{ margin: "5px" }}>
            <Button href={`/queries/${props.query.id}`}>Details</Button>
            <Button href={`/dynamic-playlist/${props.tag_id}/order/${props.order}`}>Play</Button>
          </ButtonGroup>
          <TagsList tags={props.query.included_tags} />
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default observer(DynamicPlaylistQueryItem);
