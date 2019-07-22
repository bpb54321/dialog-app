import React from 'react';
import LoginForm from "../components/LoginForm";

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
      <LoginForm queryTemplateFunction={this.loginTemplate}/>
    );
  }
}
