import React from 'react';
import {UserContextObject} from "../types/UserContextObject";
import RolePicker from "../RolePicker";
import fetchData from "../utils/fetch-data";
import LineData from "../types/LineData";
import Role from "../types/Role";

interface Props {
  context: UserContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
  roles: Role[];
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
              id
              name
            }
          }
        }
      }
    `;

    fetchData(singleDialogQuery, data.token, data.apiEndpoint, (body) => {

      // Collect the ids of the roles that
      const rolesInDialog: Role[] = body.data.dialog.lines.reduce((accumulator: Role[], line: LineData) => {
        let roleAlreadyInArray = accumulator.find((role: Role) => {
            return line.role.id === role.id;
        });

        if (!roleAlreadyInArray) {
          accumulator.push(line.role)
        }

        return accumulator;
      }, []);

      this.setState({
        roles: rolesInDialog
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
        <h1>The Choose Role Page</h1>
        <RolePicker roles={this.state.roles} setUserRoleAndChangeMode={() => {}}/>
        {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : null}
      </div>
    );
  }
}
