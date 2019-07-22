import React from 'react';
import LoginForm from "../components/LoginForm";
import {Link} from "react-router-dom";

interface Props {
}

interface State {
}

export default class AuthPage extends React.Component<Props, State> {

  loginTemplate = (email: string, password: string) => {
    return (
      `
        mutation {
            login(email: "${email}", password: "${password}") {
              token
            }
        }
      `
    );
  };

  render() {
    return (
      <>
        <h1>Login</h1>
        <LoginForm queryTemplateFunction={this.loginTemplate} fieldName={"login"}/>
        <Link to={"/sign-up"}>Sign Up</Link>
      </>
    );
  }
}
