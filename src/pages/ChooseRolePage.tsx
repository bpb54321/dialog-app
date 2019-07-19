import React from 'react';
import {UserContextObject} from "../types/UserContextObject";
import RolePicker from "../RolePicker";
import fetchData from "../utils/fetch-data";
import Line from "../Line";

interface Props {
  context: UserContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
  roles: string[];
  errorMessage: string;
}

export default class ChooseRolePage extends React.Component<Props, State> {

  state = {
    roles: [],
    errorMessage: "",
  };

  componentDidMount() {
    const {data} = this.props.context;
    const {
      params: {
        dialogId
      }
    } = this.props.match;

    const singleDialogQuery = `
      query {
        dialog(id: "${dialogId}") {
          name
          lines {
            role {
              name
            }
          }
        }
      }
    `;

    fetchData(singleDialogQuery, data.token, data.apiEndpoint, (body) => {
      body.data.dialog.lines.reduce((accumulator: string[], item: any) => {

      });
      this.setState({
        roles: []
      });
    }, (errorMessage) => {
      this.setState({
        errorMessage: errorMessage
      });
    });
  }

  render() {

    const {
      params: {
        dialogId
      }
    } = this.props.match;

    return (
      <div>
        <h1>The Choose Role Page</h1>
        <RolePicker roles={["Role 0", "Role 1"]} setUserRoleAndChangeMode={() => {}}/>
        {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : null}
      </div>
    );
  }
}
