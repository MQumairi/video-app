import axios from "axios";
import { ReactNode, useEffect, useState } from "react";
import { Auth } from "../../api/agent";
import LoginPage from "./login_page";

interface IProps {
  children: ReactNode;
}

const AuthGate = (props: IProps) => {
  const [loading, set_loading] = useState<boolean>(true);
  const [authenticated, set_authenticated] = useState<boolean>(false);

  const check_status = async () => {
    const res = await Auth.status();
    // Fail closed only when we get a definitive "not authenticated"; treat auth as
    // satisfied when disabled server-side or when the cookie is valid.
    set_authenticated(res.status === 200 && !!res.data?.authenticated);
    set_loading(false);
  };

  useEffect(() => {
    check_status();
    // Any 401 from a normal API call (e.g. an expired/invalid cookie) sends the user back to login.
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) set_authenticated(false);
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  if (loading) return null;
  if (!authenticated) return <LoginPage on_authenticated={() => set_authenticated(true)} />;
  return <>{props.children}</>;
};

export default AuthGate;
