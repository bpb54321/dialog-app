import React from 'react';
import {GlobalContextObject} from "../types/GlobalContextObject";
import fetchData from "../utils/fetch-data";
import Role from "../types/Role";
import LineData from "../types/LineData";
import Dialog from "../types/Dialog";
import {GlobalConsumer} from "../contexts/GlobalContext";

interface Props {
  context: GlobalContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
  numberOfLinesInDialog: number;
  userLineNumberIndex: number;
  userLineNumbers: number[];
  dialog: Dialog;
  errorMessage: string;
}

export default class PracticePage extends React.Component<Props, State> {

  state = {
    numberOfLinesInDialog: 0,
    userLineNumberIndex: 0,
    userLineNumbers: [],
    dialog: {
      id: "",
      name: "",
      lines: [],
    },
    errorMessage: "",
  };

  componentDidMount(): void {
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

  render() {
    return (
      <GlobalConsumer>
        {(context: GlobalContextObject) => {
            return (
              <>
                <h1>The Practice Page</h1>
                {this.state.userLineNumbers.map((lineNumber: number) => {
                  return (<li>{lineNumber}</li>);
                })}
              </>
            );
        }}

      </GlobalConsumer>
    );
  }
}
