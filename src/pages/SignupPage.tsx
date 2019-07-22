import React from 'react';
import LoginForm from "../components/LoginForm";
import {Link} from "react-router-dom";
import {GlobalContextObject} from "../contexts/GlobalContext";
import {GlobalConsumer} from "../contexts/GlobalContext";

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
      <GlobalConsumer>
        {(context: GlobalContextObject) => {
          return (
            <>
              <h1>Sign Up</h1>
              <LoginForm queryTemplateFunction={this.signupTemplate} fieldName={"signup"}/>
              <Link to={"/auth"}>Login</Link>
              {
                context.data.loggedIn
                ?
                  <p>
                    User account successfully created! Visit the <Link to={"/dialogs"}>Dialog Page</Link> to create
                    some dialogs.
                  </p>
                :
                  null
              }
            </>
          );

        }}
      </GlobalConsumer>
    );
  }
}
