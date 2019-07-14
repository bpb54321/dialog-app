/* global SpeechRecognition */
import React from 'react';
import {BrowserRouter} from 'react-router-dom';
import './App.css';

import Dialog from "./types/Dialog";
import LineData from "./types/LineData";

import RolePicker from "./RolePicker";
import LineGuess from './LineGuess';
import {InteractionMode} from "./types/InteractionMode";
import ListOfLines from "./ListOfLines";

interface AppProps {
  speechRecognition: SpeechRecognition;
}

interface AppState {
  dialogs: Dialog[];
  currentDialog: Dialog;
  numberOfLinesInDialog: number;
  userRoleLineIndex: number;
  userRole: string;
  userRoleLineNumbers: number[];
  mode: InteractionMode;
}

export class App extends React.Component<AppProps, AppState> {

  state: AppState = {
    dialogs: [],
    currentDialog: {
      roles: ["No Role"],
      name: "",
      lines: [],
    },
    numberOfLinesInDialog: 0,
    userRoleLineIndex: 0,
    userRole: "",
    userRoleLineNumbers: [],
    mode: InteractionMode.LoadingData,
  };

  async componentDidMount() {
    // Get list of dialogs
    let responseBody = await fetch("http://localhost/dialogs/");
    let responseJson: any = await responseBody.json();

    let dialogs = responseJson._embedded.dialogs;

    // Set SpeechRecognition object's settings
    this.props.speechRecognition.lang = "fr-FR";
    this.props.speechRecognition.continuous = true;
    this.props.speechRecognition.interimResults = true;

    this.setState((previousState: AppState) : object => {
      return {
        dialogs: dialogs,
        mode: InteractionMode.ChoosingDialog,
      };
    });
  }

  setUserRoleAndChangeMode = (role: string) => {
    const userRoleLineNumbers = this.calculateUserLineNumbers(
      this.state.currentDialog, role
    );

    this.setState({
      userRole: role,
      userRoleLineNumbers: userRoleLineNumbers,
      mode: InteractionMode.PracticingLines,
    });
  };

  /**
   * Given a link to a dialog and a role, returns an array of the line numbers that the role has in the dialog.
   *
   * @param dialogUrl {string} A dialog.
   * @param role {string} The name of a role that is present in the dialog.
   *
   * @return {number[]} An array of line numbers of the lines that are assigned to the given role in the dialog.
   */
  async calculateUserLineNumbers(dialogUrl: string, role: string): Promise<number[]> {

    // Get the lines for the dialog
    let responseBody = await fetch(`${dialogUrl}/lines`);
    let responseJson: any = await responseBody.json();

    let lines = responseJson._embedded.lines;

    let userRoleLines: LineData[] = lines.filter((line: LineData) => {
      return (line.role === role);
    });

    return userRoleLines.map((line: LineData) => {
      return line.key;
    });
  }

  addGuessToCurrentLineAndIncrementLineNumber = (lineGuess: string) => {
    this.setState((previousState: AppState) => {
      let currentUserRoleLineNumber: number;
      let currentUserRoleLine: LineData;
      let nextUserRoleLineIndex: number;
      let nextMode: InteractionMode;
      let nextDialog: Dialog;

      currentUserRoleLineNumber = previousState.userRoleLineNumbers[previousState.userRoleLineIndex];
      currentUserRoleLine = previousState.currentDialog.lines[currentUserRoleLineNumber];

      nextDialog = {
        ...previousState.currentDialog
      };

      nextDialog.lines[currentUserRoleLineNumber] = {
        text: currentUserRoleLine.text,
        guess: lineGuess,
        role: currentUserRoleLine.role,
        key: currentUserRoleLine.key,
      };

      nextUserRoleLineIndex = previousState.userRoleLineIndex + 1;

      if (nextUserRoleLineIndex < previousState.userRoleLineNumbers.length) {

        nextMode = InteractionMode.PracticingLines;

        return ({
          currentDialog: nextDialog,
          userRoleLineIndex: nextUserRoleLineIndex,
          mode: nextMode,
        });

      } else {

        nextMode = InteractionMode.DialogComplete;

        return ({
          currentDialog: nextDialog,
          userRoleLineIndex: previousState.userRoleLineNumbers.length - 1,
          mode: nextMode,
        });

      }
    });
  };

  render() {
    let currentUserRoleLineNumber = this.state.userRoleLineNumbers[this.state.userRoleLineIndex];

    switch (this.state.mode) {
      case InteractionMode.LoadingData:
        return <p data-testid={"loading-message"}>Waiting for data to load...</p>;
      case InteractionMode.ChoosingDialog:
        return (
          <ul>
            {
              this.state.dialogs.map((dialog: Dialog) => {
                return <li key={dialog._links.self.href}>{dialog.name}</li>;
              })
            }
          </ul>
        );

      case InteractionMode.ChoosingRole:
        return (
          <RolePicker
            roles={this.state.currentDialog.roles}
            setUserRoleAndChangeMode={this.setUserRoleAndChangeMode}
          />
        );
      case InteractionMode.PracticingLines:
        return (
          <>
            <ListOfLines
              dialog={this.state.currentDialog}
              lastLineToDisplay={currentUserRoleLineNumber - 1}
            />
            <LineGuess
              userRole={this.state.userRole}
              addLineGuessToLastLine={this.addGuessToCurrentLineAndIncrementLineNumber}
              speechRecognition={this.props.speechRecognition}
            />
          </>
        );
      case InteractionMode.DialogComplete:
        return (
          <ListOfLines
            dialog={this.state.currentDialog}
            lastLineToDisplay={this.state.numberOfLinesInDialog - 1}
          />
        );
    }
  }
}
