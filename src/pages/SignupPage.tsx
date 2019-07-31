import React from 'react';
import {Link} from "react-router-dom";
import {GlobalContextObject} from "../contexts/GlobalStateContext";
import {GlobalConsumer} from "../contexts/GlobalStateContext";
import {SignupForm} from "../components/SignupForm";

interface Props {

}

interface State {
}

export default class SignupPage extends React.Component<Props, State> {

  render() {
    return (
      <GlobalConsumer>
        {(context: GlobalContextObject) => {
          return (
            <>
              <h1>Sign Up</h1>
              {
                context.data.token
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

        }}
      </GlobalConsumer>
    );
  }
}
