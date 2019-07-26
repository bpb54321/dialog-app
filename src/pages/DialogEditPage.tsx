import React from 'react';
import {GlobalContextObject} from "../contexts/GlobalContext";
import Dialog from "../types/Dialog";
import Role from "../types/Role";
import LineData from "../types/LineData";
import fetchData from "../utils/fetch-data";
import TextInputQueryForm from "../components/TextInputQueryForm";
import {RoleWithUpdateAndDelete} from "../components/RoleWithUpdateAndDelete";
import {LineWithUpdateAndDelete} from "../components/LineWithUpdateAndDelete";
import Line from "../Line";
import {AddNewLineForm} from "../components/AddNewLineForm";

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

//region createRoleQuery
const createRoleQuery =
  `
    mutation CreateRole($name: String!, $dialogId: String!) {
      createRole(name: $name, dialogId: $dialogId) {
        id
        name
        dialog {
          id
        }
      }
    }
  `;
//endregion

//region dialogQuery
const dialogQuery =
  `
    query DialogQuery($id: String!) {
      dialog(id: $id) {
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
//endregion

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

    try {
      const dialog = await fetchData(
        dialogQuery,
        {
          id: dialogId,
        },
        "dialog",
        context
      );

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

  addRoleToParentState = (role: Role) => {
    this.setState((previousState: State) => {
      return {
        dialog: {
          ...previousState.dialog,
          roles: [...previousState.dialog.roles, role],
        }
      };
    });
  };

  addLineToParentState = (line: LineData) => {
    this.setState((previousState: State) => {
      return {
        dialog: {
          ...previousState.dialog,
          lines: [...previousState.dialog.lines, line],
        }
      };
    });
  };

  deleteRoleInDialog = (roleId: string): void => {
    this.setState((previousState) => {
      let newRoles = previousState.dialog.roles.filter((role: Role) => {
        return role.id !== roleId;
      });

      return {
        dialog: {
          ...previousState.dialog,
          roles: newRoles,
        }
      };
    });
  };

  deleteLineInDialog = (lineId: string): void => {
    this.setState((previousState) => {
      let newLines = previousState.dialog.lines.filter((line: LineData) => {
        return line.id !== lineId;
      });

      return {
        dialog: {
          ...previousState.dialog,
          lines: newLines,
        }
      };
    });
  };

  render() {
    const {dialogId} = this.props.match.params;

    return (
      <>
        {
          this.state.loading
          ?
            <p>Loading dialog...</p>
          :
            <div>
              <h1>{this.state.dialog.name}</h1>
              <div>
                <h2>Roles</h2>
                <ul>
                  {this.state.dialog.roles.map((role: Role) => {
                      return (
                        <RoleWithUpdateAndDelete
                          role={role}
                          key={role.id}
                          deleteRoleInDialog={this.deleteRoleInDialog}
                        />
                      );
                  })}
                </ul>
                <TextInputQueryForm
                  query={createRoleQuery}
                  queryVariableDefaults={{
                    name: "",
                    dialogId: dialogId,
                  }}
                  queryVariableModifiedByTextInput={"name"}
                  addValueToParentState={this.addRoleToParentState}
                  placeholderText={"Role Name"}
                />
              </div>
              <div>
                <h2>Lines</h2>
                <ul>
                  {this.state.dialog.lines.map((line: LineData) => {
                    return (
                      <LineWithUpdateAndDelete
                        line={line}
                        rolesInDialog={this.state.dialog.roles}
                        key={line.id}
                        deleteLineInDialog={this.deleteLineInDialog}
                      />
                    );
                  })}
                </ul>
                <AddNewLineForm
                  dialogId={dialogId}
                  rolesInDialog={this.state.dialog.roles}
                  addLineToDialog={this.addLineToParentState}
                />
              </div>
            </div>
        }
        {
          this.state.errorMessage
          ?
            <p>{this.state.errorMessage}</p>
          :
            null
        }
      </>
    );
  }
}
