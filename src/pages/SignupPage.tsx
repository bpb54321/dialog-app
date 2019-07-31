import React from 'react';
import {Link} from "react-router-dom";
import {useGlobalState} from "../contexts/GlobalStateContext";
import {SignupForm} from "../components/SignupForm";

interface Props {

}

export const SignupPage: React.FunctionComponent<Props> = (props) => {

  const globalState = useGlobalState();

  return (
    <>
      <h1>Sign Up</h1>
      {
        globalState.token
        ?
          <p>
            User account successfully created! Visit the <Link to={"/dialogs"}>Dialog Page</Link> to create
            some dialogs.
          </p>
        :
          <>
            <SignupForm/>
            <Link to={"/auth"}>Login</Link>
          </>
      }
    </>
  );
};
