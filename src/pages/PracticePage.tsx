import React, {useEffect, useState} from 'react';
import {useGlobalState} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";
import Role from "../types/Role";
import LineData from "../types/LineData";
import {Dialog} from "../types/Dialog";
import {InteractionMode} from "../types/InteractionMode";
import ListOfLines from "../ListOfLines";
import {LineGuess} from "../LineGuess";

//region singleDialogQuery
const singleDialogQuery = `
      query DialogQuery($id: String!) {
        dialog(id: $id) {
          name
          languageCode
          lines {
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

interface Props {
  match: any;
  chosenRole: Role;
}

export type PracticePageInterface = React.FunctionComponent<Props>;

export const PracticePage: PracticePageInterface = (props) => {
  debugger;

  const [userLineNumberIndex, setUserLineNumberIndex] = useState(0);
  const [userLineNumbers, setUserLineNumbers] = useState([] as number[]);
  const [currentLineNumber, setCurrentLineNumber] = useState(0);
  const [dialog, setDialog] = useState({} as Dialog);
  const [errorMessage, setErrorMessage] = useState("");
  const [mode, setMode] = useState(InteractionMode.LoadingData);

  const globalState = useGlobalState();

  debugger;

  /**
   * Given a dialog and a role, returns an array of the line numbers that the role has in the dialog.
   *
   * @param dialog {Dialog} A dialog.
   * @param role {Role} The role in the dialog that the user has picked to be.
   *
   * @return {number[]} An array of line numbers of the lines that are assigned to the given role in the dialog.
   */
  const calculateUserLineNumbers = (dialog: Dialog, role: Role): number[] => {
    const {lines} = dialog;

    let userLines: LineData[] = lines.filter((line: LineData) => {
      return (line.role.id === role.id);
    });

    return userLines.map((line: LineData) => {
      return line.number;
    });
  };

  const addGuessToCurrentLineAndIncrementLineNumber = (lineGuess: string) => {

    const linesUpdatedWithGuess = dialog.lines.map((line: LineData) => {
      if (line.number === currentLineNumber) {
        line.guess = lineGuess;
      }

      return line;
    });

    let nextLineIndex = userLineNumberIndex + 1;

    let nextMode: InteractionMode;
    let nextLineNumber: number;

    if (nextLineIndex < userLineNumbers.length) {

      nextMode = InteractionMode.PracticingLines;
      nextLineNumber = userLineNumbers[nextLineIndex];

    } else {

      nextMode = InteractionMode.DialogComplete;
      nextLineNumber = dialog.lines.slice(-1)[0].number; // Last line in dialog

    }

    setDialog({
      ...dialog,
      lines: linesUpdatedWithGuess,
    });
    setUserLineNumberIndex(nextLineIndex);
    setCurrentLineNumber(nextLineNumber);
    setMode(nextMode);
  };

  useEffect(() => {
    debugger;

    const {
      params: {
        dialogId
      }
    } = props.match;

    const queryVariables = {
      id: dialogId,
    };

    fetchData(singleDialogQuery, queryVariables, "dialog", globalState).then((dialog) => {

      debugger;

      // Calculate the user line numbers
      const userLineNumbers = calculateUserLineNumbers(dialog, props.chosenRole);

      let currentLineNumber: number;
      let mode: InteractionMode;

      if (userLineNumbers.length > 0) {
        mode = InteractionMode.PracticingLines;
        currentLineNumber = userLineNumbers[0];
      } else {
        mode = InteractionMode.DialogComplete;
        currentLineNumber = dialog.lines.slice(-1)[0].number;
      }

      debugger;
      setDialog(dialog);
      // setUserLineNumbers(userLineNumbers);
      debugger;
      setMode(mode);
      // setCurrentLineNumber(currentLineNumber);

      const speechRecognition = globalState.speechRecognition;
      speechRecognition.lang = dialog.languageCode;

    }).catch((error) => {
      setErrorMessage(error.message);
    })
  }, [props.match.params.dialogId, globalState, props.chosenRole]);

  debugger;
  switch (mode) {
    case InteractionMode.PracticingLines:
      return (
        <>
          <ListOfLines
            dialog={dialog}
            lastLineToDisplay={currentLineNumber - 1}
          />
          <LineGuess
            addLineGuessToLastLine={addGuessToCurrentLineAndIncrementLineNumber}
            chosenRole={props.chosenRole}
          />
          {errorMessage ? <p>{errorMessage}</p> : null}
        </>
      );
    case InteractionMode.DialogComplete:
      return (
        <>
          <ListOfLines
            dialog={dialog}
            lastLineToDisplay={currentLineNumber}
          />
          {errorMessage ? <p>{errorMessage}</p> : null}
        </>
      );
    default:
      return (
        <p>Waiting for data to load...</p>
      );
  }
};
