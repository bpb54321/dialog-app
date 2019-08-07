import React, {FunctionComponent} from 'react';
import {LoginForm} from "../components/LoginForm";
import {Link} from "react-router-dom";

interface Props {
  history: any;
}

export const LoginPage: FunctionComponent<Props> = (props) => {
  return (
    <>
      <h1>Login</h1>
      <LoginForm history={props.history} />
      <Link to={"/sign-up"}>Sign Up</Link>
    </>
  );

};
