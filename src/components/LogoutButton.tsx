import React, {useContext} from 'react';
import {GlobalStateContext} from "../contexts/GlobalStateContext";


interface Props {
}


export const LogoutButton: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalStateContext);

  const logout = () => {
    window.sessionStorage.removeItem("token");
    context.actions.setGlobalState({
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
