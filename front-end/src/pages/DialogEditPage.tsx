import React, {useEffect, useState} from 'react';
import {Dialog} from "../types/Dialog";
import Role from "../types/Role";
import LineData from "../types/LineData";
import fetchData from "../utils/fetch-data";
import {RoleWithUpdateAndDelete} from "../components/RoleWithUpdateAndDelete";
import {LineDirection, LineWithUpdateAndDelete} from "../components/LineWithUpdateAndDelete";
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

//region deleteLineQuery
const deleteLineQuery =
  `
    mutation DeleteLine($id: String!) {
      deleteLine(id: $id)
    }
  `;
//endregion

//region updateLineQuery
const updateLineQuery =
  `
    mutation UpdateLine($lines: [LineInput!]!) {
      updateLine(lines: $lines) {
        id
        text
        number
        role {
          id
          name
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

    const queryVariables = {
      id: dialogId,
    };

    fetchData(dialogQuery, queryVariables, "dialog", globalState).then((dialog) => {
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

  const deleteLineInDialog = async (lineToDelete: LineData): Promise<void> => {

    // Adjust line numbers of lines that are later than lineToDelete
    const remainingLines = dialog.lines.map((line) => {
      if (line.number > lineToDelete.number) {
        line.number--;
      }

      return line;
    })
    // Remove the lineToDelete
    .filter((line) => {
      return lineToDelete.id !== line.id;
    });

    // Optimistically update the lines on the page
    setDialog({
      ...dialog,
      lines: remainingLines
    });

    // Send deleteLine query
    const deleteLineQueryVariables = {
      id: lineToDelete.id,
    };

    fetchData(
      deleteLineQuery, deleteLineQueryVariables, "deleteLine", globalState
    ).then((deletionWasSuccessful: boolean) => {

      if(deletionWasSuccessful) {

        // Send query to update line numbers of remaining lines
        const remainingLinesIdAndNumber = remainingLines.map((line: LineData) => {
          return {
            id: line.id,
            number: line.number,
          };
        });

        const updateLineQueryVariables = {
          lines: remainingLinesIdAndNumber
        };

        fetchData(
          updateLineQuery, updateLineQueryVariables, "updateLine", globalState
        ).catch((error) => {
          setErrorMessage(error.message);
        });

      } else {
        setErrorMessage(`There was a problem when attempting to delete the Line with id ${lineToDelete.id}`);
      }
    }).catch((error) => {
      setErrorMessage(error.message);
    });

  };

  const updateLine = async (lineToUpdate: LineData): Promise<void> => {

    const linesWithUpdatedLine = dialog.lines.map((line) => {
      if (line.id === lineToUpdate.id) {
        return lineToUpdate;
      } else {
        return line;
      }
    });

    setDialog({
      ...dialog,
      lines: linesWithUpdatedLine,
    });

    const queryVariables = {
      lines: [
        {
          id: lineToUpdate.id,
          text: lineToUpdate.text,
          roleId: lineToUpdate.role.id,
          number: lineToUpdate.number,
        }
      ],

    };

    try {
      await fetchData(updateLineQuery, queryVariables, "updateLine", globalState);
    } catch(error) {
      setErrorMessage(error.message);
    }
  };

  const changeLineOrder = (lineToUpdate: LineData, direction: LineDirection): void => {

    let lineToUpdateCurrentNumber = lineToUpdate.number;
    let linesToUpdateInApiQuery: LineData[] = [];
    const updatedLines = dialog.lines.map((line) => {
      if (direction === LineDirection.Up) {
        if (line.number === lineToUpdateCurrentNumber) {
          line.number--;
          linesToUpdateInApiQuery.push(line);
        } else if (line.number === (lineToUpdateCurrentNumber - 1)) {
          line.number++;
          linesToUpdateInApiQuery.push(line);
        }
        return line;
      } else {
        if (line.number === lineToUpdateCurrentNumber) {
          line.number++;
          linesToUpdateInApiQuery.push(line);
        } else if (line.number === (lineToUpdateCurrentNumber + 1)) {
          line.number--;
          linesToUpdateInApiQuery.push(line);
        }
        return line;
      }
    });

    setDialog({
      ...dialog,
      lines: updatedLines,
    });

    const linesFormattedForQuery = linesToUpdateInApiQuery.map((line) => {
      return {
        id: line.id,
        number: line.number,
      };
    });

    const queryVariables = {
      lines: linesFormattedForQuery,
    };

    fetchData(updateLineQuery, queryVariables, "updateLine", globalState)
      .catch((error) => {
        setErrorMessage(error.message);
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
              <ol>
                {dialog.lines.sort((firstLine, secondLine) => {
                  return firstLine.number - secondLine.number;
                }).map((line: LineData, index: number, lines: LineData[]) => {
                  return (
                    <LineWithUpdateAndDelete
                      line={line}
                      rolesInDialog={dialog.roles}
                      key={line.id}
                      deleteLineInDialog={deleteLineInDialog}
                      updateLine={updateLine}
                      changeLineOrder={changeLineOrder}
                      hasMoveLineUpButton={index !== 0}
                      hasMoveLineDownButton={index !== (lines.length - 1)}
                    />
                  );
                })}
              </ol>
              <AddNewLineForm
                numberOfLinesInDialog={dialog.lines.length}
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
