import React, {useState, useEffect} from 'react';
import {Dialog} from "../types/Dialog";
import Role from "../types/Role";
import LineData from "../types/LineData";
import fetchData from "../utils/fetch-data";
import {RoleWithUpdateAndDelete} from "../components/RoleWithUpdateAndDelete";
import {LineWithUpdateAndDelete} from "../components/LineWithUpdateAndDelete";
import {AddNewLineForm} from "../components/AddNewLineForm";
import {AddNewRoleForm} from "../components/AddNewRoleForm";
import {useGlobalState} from "../contexts/GlobalStateContext";

interface Props {
  match: any;
  location: any;
  history: any;
}

//region dialogQuery
const dialogQuery =
  `
    query DialogQuery($id: String!) {
      dialog(id: $id) {
        id
        name
        languageCode
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

export const DialogEditPage: React.FunctionComponent<Props> = (props) => {

  const [dialog, setDialog] = useState({} as Dialog);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const globalState = useGlobalState();

  useEffect(() => {

    const {dialogId} = props.match.params;

    const queryVaribles = {
      id: dialogId,
    };

    fetchData(dialogQuery, queryVaribles, "dialog", globalState).then((dialog) => {
      setDialog(dialog);
      setLoading(false);
    }).catch((error) => {
      setErrorMessage(error.message);
    });
  }, [props.match, globalState]);

  const addRoleToParentState = (role: Role) => {
    setDialog({
      ...dialog,
      roles: [...dialog.roles, role]
    });
  };

  const addLineToParentState = (line: LineData) => {
    setDialog({
      ...dialog,
      lines: [...dialog.lines, line]
    });
  };

  const deleteRoleInDialog = (roleId: string): void => {

    const newRoles = dialog.roles.filter((role: Role) => {
      return role.id !== roleId;
    });

    setDialog({
      ...dialog,
      roles: newRoles
    });
  };

  const deleteLineInDialog = (lineId: string): void => {

    const newLines = dialog.lines.filter((line: LineData) => {
      return line.id !== lineId;
    });

    setDialog({
      ...dialog,
      lines: newLines
    });
  };

  const {dialogId} = props.match.params;

  return (
    <>
      {
        loading
        ?
          <p>Loading dialog...</p>
        :
          <div>
            <h1>Edit Dialog: {dialog.name}</h1>
            <div>
              <h2>Roles</h2>
              <ul>
                {dialog.roles.map((role: Role) => {
                    return (
                      <RoleWithUpdateAndDelete
                        role={role}
                        key={role.id}
                        deleteRoleInDialog={deleteRoleInDialog}
                      />
                    );
                })}
              </ul>
              <AddNewRoleForm dialogId={dialogId} addRoleToDialog={addRoleToParentState}/>
            </div>
            <div>
              <h2>Lines</h2>
              <ul>
                {dialog.lines.map((line: LineData) => {
                  return (
                    <LineWithUpdateAndDelete
                      line={line}
                      rolesInDialog={dialog.roles}
                      key={line.id}
                      deleteLineInDialog={deleteLineInDialog}
                    />
                  );
                })}
              </ul>
              <AddNewLineForm
                dialogId={dialogId}
                rolesInDialog={dialog.roles}
                addLineToDialog={addLineToParentState}
              />
            </div>
          </div>
      }
      {
        errorMessage
        ?
          <p>{errorMessage}</p>
        :
          null
      }
    </>
  );
};
