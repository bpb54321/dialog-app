import React from 'react';
import {GlobalContextObject} from "../types/GlobalContextObject";
import fetchData from "../utils/fetch-data";
import Role from "../types/Role";
import LineData from "../types/LineData";
import Dialog from "../types/Dialog";
import {GlobalConsumer} from "../contexts/GlobalContext";
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
  dialog: Dialog;
  mode: InteractionMode;
  errorMessage: string;
}

export default class PracticePage extends React.Component<Props, State> {

  state = {
    userLineNumberIndex: 0,
    userLineNumbers: [],
    dialog: {
      id: "",
      name: "",
      lines: [],
    },
    errorMessage: "",
    mode: InteractionMode.PracticingLines,
  };

  componentDidMount(): void {
    const {data} = this.props.context;
    const {
      params: {
        dialogId
      }
    } = this.props.match;


    //region query
    const singleDialogQuery = `
      query {
        dialog(id: "${dialogId}") {
          name
          lines {
            text
            guess
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

    fetchData(singleDialogQuery, data.token, data.apiEndpoint, (body) => {
      const {dialog} = body.data;

      // Calculate the user line numbers
      const userLineNumbers = this.calculateUserLineNumbers(dialog, data.chosenRole);

      this.setState({
        dialog: dialog,
        userLineNumbers: userLineNumbers,
      });
    }, (errorMessage) => {
      this.setState({
        errorMessage: errorMessage
      });
    });
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
      let currentLineNumber: number;
      let nextLineIndex: number;
      let nextMode: InteractionMode;
      let nextDialog: Dialog;

      currentLineNumber = previousState.userLineNumbers[previousState.userLineNumberIndex];

      nextDialog = {
        ...previousState.dialog
      };

      nextDialog.lines[currentLineNumber].guess = lineGuess;

      nextLineIndex = previousState.userLineNumberIndex + 1;

      if (nextLineIndex < previousState.userLineNumbers.length) {

        nextMode = InteractionMode.PracticingLines;

        return ({
          ...previousState,
          dialog: nextDialog,
          userLineNumberIndex: nextLineIndex,
          mode: nextMode,
        });

      } else {

        nextMode = InteractionMode.DialogComplete;

        return ({
          ...previousState,
          dialog: nextDialog,
          userLineNumberIndex: previousState.userLineNumbers.length - 1,
          mode: nextMode,
        });

      }
    });
  };

  render() {
    return (
      <>
        <GlobalConsumer>
          {(context: GlobalContextObject) => {
            const {userLineNumbers, userLineNumberIndex} = this.state;

            let currentLineNumber = 0;
            if (userLineNumbers.length > 0) {
              currentLineNumber = userLineNumbers[userLineNumberIndex];
            }

            switch (this.state.mode) {
                case InteractionMode.PracticingLines:
                  return (
                    <>
                      <h1>The Practice Page</h1>
                      <ListOfLines
                        dialog={this.state.dialog}
                        lastLineToDisplay={currentLineNumber - 1}
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
                      lastLineToDisplay={this.state.dialog.lines.length - 1}
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
