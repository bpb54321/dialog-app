import React, {ChangeEvent, FormEvent} from 'react';
import GraphqlError from "../types/GraphqlError";
import { UserConsumer } from '../contexts/UserContext';
import { UserContextObject } from '../types/UserContextObject';

interface Props {
}

interface State {
  email?: string;
  password?: string;
  errorMessage?: string;
}

export default class AuthPage extends React.Component<Props, State> {

  state = {
    email: "",
    password: "",
    errorMessage: "",
  };

  handleSubmit = (event: FormEvent, userContext: UserContextObject) => {
    event.preventDefault();

    const {actions} = userContext;

    const {email, password} = this.state;

    const loginMutation = `
      mutation {
          login(email: "${email}", password: "${password}") {
            token
          }
      }
    `;

    let graphqlEndpoint: string;
    if (process.env.NODE_ENV === "development") {
      graphqlEndpoint = "http://localhost:4000";
    } else { // production
        graphqlEndpoint = "https://enthousiaste-livre-99440.herokuapp.com/";
    }

    fetch(graphqlEndpoint, {
      method: "POST",
      body: JSON.stringify({
        query: loginMutation,
      }),
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    }).then((response) => {
      return response.json();
    }).then((body) => {
      if (body.errors) {
        let errorMessage = body.errors.reduce((accumulator: string, error: GraphqlError) => {
          return accumulator + " " + error.message;
        }, "");
        this.setState({
          errorMessage: errorMessage
        });
      } else {
        const token = body.data.login.token;
        actions.setUserData(token);
      }
      console.log(body);
    }).catch((error) => {
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
      <UserConsumer>
        {(userContext: UserContextObject) => {
          return (
            <div>
              <h1>The Login / Signup Page</h1>
              <form
                className={"auth-form"}
                onSubmit={(event) => this.handleSubmit(event, userContext)}
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
                  <button type={"button"}>Switch to Signup</button>
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
      </UserConsumer>
    );
  }
}