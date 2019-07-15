import React, {ChangeEvent, FormEvent, SyntheticEvent} from 'react';

interface Props {
}

interface State {
  email?: string;
  password?: string;
}

export default class AuthPage extends React.Component<Props, State> {

  state = {
    email: "",
    password: "",
  };

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const {email, password} = this.state;

    const loginMutation = `
      mutation {
          login(email: "${email}", password: "${password})" {
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
      console.log(response);
    });
    // }).then(() => {
    //
    // });

    console.log(loginMutation);
  };

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
        [event.target.id]: event.target.value,
      });
  };

  render() {
    return (
      <div>
        <h1>The Auth Page</h1>
        <form
          className={"auth-form"}
          onSubmit={this.handleSubmit}
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
        </form>
      </div>
    );
  }
}
