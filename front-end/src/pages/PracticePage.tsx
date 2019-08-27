import React, {useEffect, useState} from 'react';
import {useGlobalState} from "../contexts/GlobalStateContext";
import fetchData from "../utils/fetch-data";
import Role from "../types/Role";
import LineData from "../types/LineData";
import {Dialog} from "../types/Dialog";
import {InteractionMode} from "../types/InteractionMode";
import ListOfLines from "../components/ListOfLines";
import {LineGuess} from "../components/LineGuess";

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

  const [state, setState] = useState({
    userLineNumberIndex: 0,
    userLineNumbers: [] as number[],
    lastLineNumberToDisplay: 1,
    dialog: {} as Dialog,
    mode: InteractionMode.LoadingData,
    errorMessage: "",
  });

  const globalState = useGlobalState();

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

  const addGuessToCurrentLineAndDisplayCurrentLine = (lineGuess: string) => {

    const linesUpdatedWithGuess = state.dialog.lines.map((line: LineData) => {
      if (line.number === state.lastLineNumberToDisplay) {
        line.guess = lineGuess;
      }

      return line;
    });

    setState({
      ...state,
      dialog: {
        ...state.dialog,
        lines: linesUpdatedWithGuess,
      },
      lastLineNumberToDisplay: state.lastLineNumberToDisplay,
      mode: InteractionMode.DisplayingOtherLines,
    });

  };

  const handleNextLineClick = () => {

    let nextMode: InteractionMode;
    let newLastLineNumberToDisplay = state.lastLineNumberToDisplay + 1;

    if (newLastLineNumberToDisplay >= state.dialog.lines.length) {
      nextMode = InteractionMode.DialogComplete;
      newLastLineNumberToDisplay = state.dialog.lines.length;
    } else if (state.userLineNumbers.includes(newLastLineNumberToDisplay)) {
      nextMode = InteractionMode.GuessingOurLine;
    } else {
      nextMode = InteractionMode.DisplayingOtherLines;
    }

    setState({
      ...state,
      lastLineNumberToDisplay: newLastLineNumberToDisplay,
      mode: nextMode,
    });
  };

  useEffect(() => {
    const {dialogId} = props.match.params;

    const queryVariables = {
      id: dialogId,
    };

    fetchData(singleDialogQuery, queryVariables, "dialog", globalState).then((dialog) => {
      // Calculate the user line numbers
      const userLineNumbers = calculateUserLineNumbers(dialog, props.chosenRole);

      let currentLineNumber = state.lastLineNumberToDisplay;
      let mode: InteractionMode;

      if (userLineNumbers.length === 0) {
        mode = InteractionMode.DialogComplete;
        currentLineNumber = dialog.lines.slice(-1)[0].number;
      } else {
        if (userLineNumbers.includes(currentLineNumber)) {
          mode = InteractionMode.GuessingOurLine;
        } else {
          mode = InteractionMode.DisplayingOtherLines;
        }
      }

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

  switch (state.mode) {
    case InteractionMode.DisplayingOtherLines:
      return (
        <>
          <ListOfLines
            dialog={state.dialog}
            lastLineToDisplay={state.lastLineNumberToDisplay}
          />
          <button
            onClick={handleNextLineClick}
          >
            Next Line
          </button>
          {state.errorMessage ? <p>{state.errorMessage}</p> : null}
        </>
      );

    case InteractionMode.GuessingOurLine:
      return (
        <>
          <ListOfLines
            dialog={state.dialog}
            lastLineToDisplay={state.lastLineNumberToDisplay - 1}
          />
          <LineGuess
            addLineGuessToLastLine={addGuessToCurrentLineAndDisplayCurrentLine}
            chosenRole={props.chosenRole}
            dialogLanguageCode={state.dialog.languageCode}
          />
          {state.errorMessage ? <p>{state.errorMessage}</p> : null}
        </>
      );
    case InteractionMode.DialogComplete:
      return (
        <>
          <ListOfLines
            dialog={state.dialog}
            lastLineToDisplay={state.lastLineNumberToDisplay}
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
