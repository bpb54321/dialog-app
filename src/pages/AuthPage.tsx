import React from 'react';
import LoginForm from "../components/LoginForm";
import {Link} from "react-router-dom";

interface Props {
}

interface State {
}

export default function AuthPage(props: Props) {
  return (
    <>
      <h1>Login</h1>
      <LoginForm />
      <Link to={"/sign-up"}>Sign Up</Link>
    </>
  );

}
