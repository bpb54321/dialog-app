import React from 'react';
import {GlobalContextObject} from "../contexts/GlobalContext";
import Dialog from "../types/Dialog";
import Role from "../types/Role";
import LineData from "../types/LineData";
import fetchData from "../utils/fetch-data";

interface Props {
  context: GlobalContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
  dialog: Dialog;
  loading: boolean;
  errorMessage: string;
}

export default class DialogEditPage extends React.Component<Props, State> {

  state = {
    dialog: {
      id: "",
      name: "",
      roles: [],
      lines: [],
    },
    loading: true,
    errorMessage: "",
  };

  async componentDidMount() {

    const {context} = this.props;
    const {dialogId} = this.props.match.params;

    const query =
      `
        query {
          dialog(id: "${dialogId}") {
            id
            name
            roles {
              id
              name
            }
            lines {
              id
              text
              number
              role {
                id
                name
              }
            }
          }
        }
      `;

    try {
      const dialog = await fetchData(query, "dialog", context);
      this.setState({
        dialog,
        loading: false,
      });
    } catch(error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  }

  render() {
    return (
      <>
        {
          this.state.loading
          ?
            <p>Loading dialog...</p>
          :
            <div>
              <h2>{this.state.dialog.name}</h2>
              <ul>
                {this.state.dialog.roles.map((role: Role) => {
                    return (
                      <li>{role.name}</li>
                    );
                })}
              </ul>
              <ul>
                {this.state.dialog.lines.map((line: LineData) => {
                  return (
                    <li>
                      <div>{line.number}</div>
                      <div>{line.role}</div>
                      <div>{line.text}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
        }
      </>

    );
  }
}
