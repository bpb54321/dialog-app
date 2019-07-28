import React from 'react';
import {GlobalConsumer, GlobalContextObject} from "../contexts/GlobalContext";
import fetchData from "../utils/fetch-data";
import Role from "../types/Role";
import LineData from "../types/LineData";
import {Dialog} from "../types/Dialog";
import {InteractionMode} from "../types/InteractionMode";
import ListOfLines from "../ListOfLines";
import LineGuess from "../LineGuess";

interface Props {
  context: GlobalContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
  userLineNumberIndex: number;
  userLineNumbers: number[];
  currentLineNumber: number;
  dialog: Dialog;
  mode: InteractionMode;
  errorMessage: string;
}

//region singleDialogQuery
const singleDialogQuery = `
      query DialogQuery($id: String!) {
        dialog(id: $id) {
          name
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

export default class PracticePage extends React.Component<Props, State> {

  state = {
    userLineNumberIndex: 0,
    userLineNumbers: [],
    currentLineNumber: 0,
    dialog: {
      id: "",
      name: "",
      lines: [],
      roles: [],
      languageCode: "",
    },
    errorMessage: "",
    mode: InteractionMode.PracticingLines,
  };

  async componentDidMount(): Promise<void> {

    const {
      params: {
        dialogId
      }
    } = this.props.match;

    const queryVariables = {
      id: dialogId,
    };

    fetchData(singleDialogQuery, queryVariables, "dialog", this.props.context).then((dialog) => {

      // Calculate the user line numbers
      const userLineNumbers = this.calculateUserLineNumbers(dialog, this.props.context.data.chosenRole);

      let currentLineNumber: number;
      let mode: InteractionMode;

      if (userLineNumbers.length > 0) {
        mode = InteractionMode.PracticingLines;
        currentLineNumber = userLineNumbers[0];
      } else {
        mode = InteractionMode.DialogComplete;
        currentLineNumber = dialog.lines.slice(-1)[0].number;
      }

      this.setState({
        dialog: dialog,
        userLineNumbers: userLineNumbers,
        mode,
        currentLineNumber,
      });

      const speechRecognition = this.props.context.data.speechRecognition;
      speechRecognition.lang = dialog.languageCode;
      
    }).catch((error) => {
      this.setState({
        errorMessage: error.message
      });
    })

  }

  /**
   * Given a dialog and a role, returns an array of the line numbers that the role has in the dialog.
   *
   * @param dialog {Dialog} A dialog.
   * @param role {Role} The role in the dialog that the user has picked to be.
   *
   * @return {number[]} An array of line numbers of the lines that are assigned to the given role in the dialog.
   */
  calculateUserLineNumbers(dialog: Dialog, role: Role): number[] {
    const {lines} = dialog;

    let userLines: LineData[] = lines.filter((line: LineData) => {
      return (line.role.id === role.id);
    });

    return userLines.map((line: LineData) => {
      return line.number;
    });
  }

  addGuessToCurrentLineAndIncrementLineNumber = (lineGuess: string) => {
    this.setState((previousState: State) => {

      const {dialog} = previousState;

      const linesUpdatedWithGuess = dialog.lines.map((line: LineData) => {
          if (line.number === this.state.currentLineNumber) {
            line.guess = lineGuess;
          }

          return line;
      });

      let nextLineIndex: number = previousState.userLineNumberIndex + 1;

      let nextMode: InteractionMode;
      let nextLineNumber: number;

      if (nextLineIndex < previousState.userLineNumbers.length) {

        nextMode = InteractionMode.PracticingLines;
        nextLineNumber = previousState.userLineNumbers[nextLineIndex];

      } else {

        nextMode = InteractionMode.DialogComplete;
        nextLineNumber = dialog.lines.slice(-1)[0].number; // Last line in dialog

      }

      return ({
        ...previousState,
        dialog: {
          ...dialog,
          lines: linesUpdatedWithGuess,
        },
        userLineNumberIndex: nextLineIndex,
        currentLineNumber: nextLineNumber,
        mode: nextMode,
      });
    });
  };

  render() {
    return (
      <>
        <GlobalConsumer>
          {(context: GlobalContextObject) => {

            switch (this.state.mode) {
                case InteractionMode.PracticingLines:
                  return (
                    <>
                      <ListOfLines
                        dialog={this.state.dialog}
                        lastLineToDisplay={this.state.currentLineNumber - 1}
                      />
                      <LineGuess
                        userRole={context.data.chosenRole}
                        addLineGuessToLastLine={this.addGuessToCurrentLineAndIncrementLineNumber}
                        speechRecognition={context.data.speechRecognition}
                      />
                    </>
                  );
                case InteractionMode.DialogComplete:
                  return (
                    <ListOfLines
                      dialog={this.state.dialog}
                      lastLineToDisplay={this.state.currentLineNumber}
                    />
                  );
              }
          }}
        </GlobalConsumer>
        {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : null}
      </>
    );
  }
}
