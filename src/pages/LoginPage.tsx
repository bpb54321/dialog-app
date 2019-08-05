import React, {FunctionComponent} from 'react';
import {LoginForm, LoginFormProps} from "../components/LoginForm";
import {Link} from "react-router-dom";
import {withLoadingSpinner} from "../higher-order-components/withLoadingSpinner";


interface Props {
  history: any;
}

const LoginFormWithLoadingSpinner = withLoadingSpinner<LoginFormProps>(LoginForm);

export const LoginPage: FunctionComponent<Props> = (props) => {
  return (
    <>
      <h1>Login</h1>
      <LoginFormWithLoadingSpinner history={props.history} />
      <Link to={"/sign-up"}>Sign Up</Link>
    </>
  );

};
