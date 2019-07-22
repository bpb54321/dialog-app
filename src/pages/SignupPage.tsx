import React from 'react';
import LoginForm from "../components/LoginForm";
import {Link} from "react-router-dom";

interface Props {
}

interface State {
}

export default class SignupPage extends React.Component<Props, State> {

  signupTemplate = (email: string, password: string, name?: string) => {
    return (
      `
        mutation {
            signup(email: "${email}", password: "${password}", name: "${name}") {
              token,
              user {
                name
              }
            }
        }
      `
    );
  };

  render() {
    return (
      <>
        <h1>Sign Up</h1>
        <LoginForm queryTemplateFunction={this.signupTemplate} fieldName={"signup"}/>
        <Link to={"/auth"}>Login</Link>
      </>
    );
  }
}
