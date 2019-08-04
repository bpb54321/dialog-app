import React from 'react';
import {useGlobalDispatch, useGlobalState} from "../contexts/GlobalStateContext";


interface Props {
}


export const LogoutButton: React.FunctionComponent<Props> = (props) => {

  const globalState = useGlobalState();
  const globalDispatch = useGlobalDispatch();

  const logout = () => {
    window.sessionStorage.removeItem("token");
    globalDispatch({
      ...globalState,
      token: "",
    });

  };

  return (
    <button
      className={"nav-link"}
      onClick={logout}
    >
      Log Out
    </button>
  );
};
