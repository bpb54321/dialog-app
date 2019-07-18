import React from 'react';
import GraphqlError from "../types/GraphqlError";
import {UserContextObject} from "../types/UserContextObject";
import Dialog from "../types/Dialog";
import {Link} from "react-router-dom";

interface Props {
  context: UserContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
  errorMessage: string;
  dialogs: Dialog[];
}

export default class DialogListPage extends React.Component<Props, State> {

  state = {
    errorMessage: "",
    dialogs: [],
  };

  componentDidMount() {
    const {data} = this.props.context;

    const dialogs = `
      query {
          dialogs {
            name
            id
          }
      }
    `;

    fetch(data.apiEndpoint, {
      method: "POST",
      body: JSON.stringify({
        query: dialogs,
      }),
      headers: {
        "Authorization": `Bearer ${data.token}`,
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
        this.setState({
          dialogs: body.data.dialogs
        });
      }
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <div>
        <h1>The Dialog List Page</h1>
        <ul>
          {this.state.dialogs.map(
            (dialog: Dialog) => {
              return (
                <li key={dialog.id}>
                  <Link to={`${this.props.match.url}/${dialog.id}/choose-role`}>{dialog.name}</Link>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}
