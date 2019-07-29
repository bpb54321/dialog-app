import React, {useContext} from 'react';
import {GlobalContext} from "../contexts/GlobalContext";


interface Props {
}


export const LogoutButton: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

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
