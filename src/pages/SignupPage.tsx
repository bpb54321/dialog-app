import React from 'react';
import LoginForm from "../components/LoginForm";

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
      <LoginForm queryTemplateFunction={this.signupTemplate}/>
    );
  }
}
