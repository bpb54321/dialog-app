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

  const [state, setState] = useState({
    userLineNumberIndex: 0,
    userLineNumbers: [] as number[],
    currentLineNumber: 0,
    dialog: {} as Dialog,
    mode: InteractionMode.LoadingData,
    errorMessage: "",
  });

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
    debugger;
    const {lines} = dialog;

    let userLines: LineData[] = lines.filter((line: LineData) => {
      return (line.role.id === role.id);
    });

    return userLines.map((line: LineData) => {
      return line.number;
    });
  };

  const addGuessToCurrentLineAndIncrementLineNumber = (lineGuess: string) => {

    const linesUpdatedWithGuess = state.dialog.lines.map((line: LineData) => {
      if (line.number === state.currentLineNumber) {
        line.guess = lineGuess;
      }

      return line;
    });

    let nextLineIndex = state.userLineNumberIndex + 1;

    let nextMode: InteractionMode;
    let nextLineNumber: number;

    if (nextLineIndex < state.userLineNumbers.length) {

      nextMode = InteractionMode.PracticingLines;
      nextLineNumber = state.userLineNumbers[nextLineIndex];

    } else {

      nextMode = InteractionMode.DialogComplete;
      nextLineNumber = state.dialog.lines.slice(-1)[0].number; // Last line in dialog

    }

    setState({
      ...state,
      dialog: {
        ...state.dialog,
        lines: linesUpdatedWithGuess,
      },
      userLineNumberIndex: nextLineIndex,
      currentLineNumber: nextLineNumber,
      mode: nextMode,
    });
  };

  useEffect(() => {
    debugger;

    const {dialogId} = props.match.params;

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

      const speechRecognition = globalState.speechRecognition;
      speechRecognition.lang = dialog.languageCode;

      debugger;
      setState((previousState) => {
        return {
          ...previousState,
          dialog,
          userLineNumbers,
          mode,
          currentLineNumber,
        }
      });
    }).catch((error) => {
      setState((previousState) => {
        return {
          ...previousState,
          errorMessage: error.message,
        }
      });
    })
  }, [props.match.params, globalState, props.chosenRole]);

  debugger;
  switch (state.mode) {
    case InteractionMode.PracticingLines:
      return (
        <>
          <ListOfLines
            dialog={state.dialog}
            lastLineToDisplay={state.currentLineNumber - 1}
          />
          <LineGuess
            addLineGuessToLastLine={addGuessToCurrentLineAndIncrementLineNumber}
            chosenRole={props.chosenRole}
          />
          {state.errorMessage ? <p>{state.errorMessage}</p> : null}
        </>
      );
    case InteractionMode.DialogComplete:
      return (
        <>
          <ListOfLines
            dialog={state.dialog}
            lastLineToDisplay={state.currentLineNumber}
          />
          {state.errorMessage ? <p>{state.errorMessage}</p> : null}
        </>
      );
    default:
      return (
        <p>Waiting for data to load...</p>
      );
  }
};
