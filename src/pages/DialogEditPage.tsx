import React from 'react';
import {GlobalContextObject} from "../contexts/GlobalContext";
import Dialog from "../types/Dialog";
import Role from "../types/Role";
import LineData from "../types/LineData";
import fetchData from "../utils/fetch-data";
import TextInputQueryForm from "../components/TextInputQueryForm";
import {RoleWithUpdateAndDelete} from "../components/RoleWithUpdateAndDelete";

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

//region query
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
                        <li key={role.id}>
                          <RoleWithUpdateAndDelete role={role} />
                        </li>
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
