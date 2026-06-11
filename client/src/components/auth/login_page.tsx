import { Button, FormGroup, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { Auth } from "../../api/agent";

interface IProps {
  on_authenticated: () => void;
}

const LoginPage = (props: IProps) => {
  const [password, set_password] = useState<string>("");
  const [error, set_error] = useState<string>("");
  const [submitting, set_submitting] = useState<boolean>(false);

  const handle_submit = async () => {
    if (password.length === 0 || submitting) return;
    set_submitting(true);
    set_error("");
    const res = await Auth.login(password);
    set_submitting(false);
    if (res.status === 200 && res.data?.authenticated) {
      props.on_authenticated();
      return;
    }
    set_error("Incorrect password");
    set_password("");
  };

  const handle_key_down = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") handle_submit();
  };

  return (
    <FormGroup sx={{ maxWidth: "360px", margin: "120px auto 0 auto", gap: "15px" }}>
      <Typography variant="h5">Enter password</Typography>
      <TextField
        type="password"
        label="Password"
        autoFocus
        value={password}
        error={error.length > 0}
        helperText={error || " "}
        onChange={(event) => set_password(event.target.value)}
        onKeyDown={handle_key_down}
      />
      <Button variant="contained" onClick={handle_submit} disabled={password.length === 0 || submitting}>
        Unlock
      </Button>
    </FormGroup>
  );
};

export default LoginPage;
