import React from 'react';
import GraphqlError from "../types/GraphqlError";
import {UserContextObject} from "../types/UserContextObject";
import Dialog from "../types/Dialog";
import {Link} from "react-router-dom";
import fetchData from "../utils/fetch-data";

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

    const dialogQuery = `
      query {
          dialogs {
            name
            id
          }
      }
    `;

    fetchData(dialogQuery, data.token, data.apiEndpoint, (body) => {
      this.setState({
        dialogs: body.data.dialogs
      });
    }, (errorMessage) => {
      this.setState({
        errorMessage: errorMessage
      });
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
