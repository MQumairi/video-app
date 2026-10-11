import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect, useState } from "react";
import { PersistentQueries } from "../../../api/agent";
import IPersistentQuery, { TEMPLATE_MERGE_HELP, TEMPLATE_STUDIOS_HELP } from "../../../models/persistent_query";

const NO_TEMPLATE = -1;

interface IProps {
  template_id: number | null;
  on_change: (template_id: number | null) => void;
}

const TemplateSelector = (props: IProps) => {
  const [templates, set_templates] = useState<IPersistentQuery[]>([]);

  useEffect(() => {
    const fetch_templates = async () => {
      const res = await PersistentQueries.list();
      if (res.status !== 200) return;
      set_templates(res.data.filter((q: IPersistentQuery) => q.is_template));
    };
    fetch_templates();
  }, []);

  const handle_change = (event: any) => {
    const template_id = +event.target.value;
    props.on_change(template_id === NO_TEMPLATE ? null : template_id);
  };

  // Wait for the templates to load, so the select never holds a value missing from its options
  if (props.template_id !== null && !templates.some((t) => t.id === props.template_id)) return <div></div>;

  return (
    <FormControl sx={{ flexGrow: "100" }}>
      <InputLabel id="template-selector-label">Template</InputLabel>
      <Select labelId="template-selector-label" label="Template" value={props.template_id ?? NO_TEMPLATE} onChange={handle_change}>
        <MenuItem value={NO_TEMPLATE}>None</MenuItem>
        {templates.map((template) => (
          <MenuItem key={template.id} value={template.id}>
            {template.name}
          </MenuItem>
        ))}
      </Select>
      {props.template_id !== null && (
        <FormHelperText>
          {TEMPLATE_MERGE_HELP} {TEMPLATE_STUDIOS_HELP}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default TemplateSelector;
