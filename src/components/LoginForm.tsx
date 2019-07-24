import React, {ChangeEvent, FormEvent} from 'react';
import {GlobalContextObject} from "../contexts/GlobalContext";
import {GlobalConsumer} from "../contexts/GlobalContext";
import fetchData from "../utils/fetch-data";

interface Props {
  fieldName: string;
  queryTemplateFunction: (email: string, password: string, name?: string) => string;
}

interface State {
  email?: string;
  password?: string;
  errorMessage?: string;
}

export default class LoginForm extends React.Component<Props, State> {

  state = {
    email: "",
    password: "",
    errorMessage: "",
  };

  handleSubmit = async (event: FormEvent, context: GlobalContextObject) => {
    event.preventDefault();

    const {email, password} = this.state;

    const query =
      `
        mutation {
            login(email: "${email}", password: "${password}") {
              token
            }
        }
      `;

    try {
      const {token} = await fetchData(query, "login", context);
      context.actions.setGlobalState({
        token,
        loggedIn: true,
      });
    } catch (error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  };

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  render() {
    return (
      <GlobalConsumer>
        {(context: GlobalContextObject) => {
          return (
            <div>
              <form
                className={"auth-form"}
                onSubmit={(event) => this.handleSubmit(event, context)}
              >
                <div className={"form-control"}>
                  <label htmlFor="email">Email</label>
                  <input
                    id={"email"}
                    type={"email"}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className={"form-control"}>
                  <label htmlFor="password">Password</label>
                  <input
                    id={"password"}
                    type={"password"}
                    onChange={this.handleInputChange}
                  />
                </div>
                <div className="form-actions">
                  <button type={"submit"}>Submit</button>
                </div>
                {
                  this.state.errorMessage
                  ?
                    <p>{this.state.errorMessage}</p>
                  :
                    null
                }
              </form>
            </div>
          );
        }}
      </GlobalConsumer>
    );
  }
}
