import React, {ChangeEvent, FormEvent} from 'react';
import {GlobalContextObject} from "../types/GlobalContextObject";
import GraphqlError from "../types/GraphqlError";
import {GlobalConsumer} from "../contexts/GlobalContext";

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

  handleSubmit = (event: FormEvent, context: GlobalContextObject) => {
    event.preventDefault();

    const {actions} = context;

    const {email, password} = this.state;

    const query = this.props.queryTemplateFunction(email, password);

    fetch(context.data.apiEndpoint, {
      method: "POST",
      body: JSON.stringify({
        query: query,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    }).then((response) => {
      debugger;
      return response.json();
    }).then((body) => {
      debugger;
      if (body.errors) {
        let errorMessage = body.errors.reduce((accumulator: string, error: GraphqlError) => {
          return accumulator + " " + error.message;
        }, "");
        this.setState({
          errorMessage: errorMessage
        });
      } else {
        const result = body.data[this.props.fieldName];
        const token = result.token;
        actions.setUserData(token);
      }
    }).catch((error) => {
      this.setState({
        errorMessage: error.message
      });
      console.log(error);
    });
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
                {this.state.errorMessage
                  ? <p>{this.state.errorMessage}</p>
                  : null
                }
              </form>
            </div>
          );
        }}
      </GlobalConsumer>
    );
  }
}
