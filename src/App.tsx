import React from 'react';
import './App.css';

import Dialog from "./types/Dialog";
import LineData from "./types/LineData";
import Line from "./Line";
import Button from "./Button";

import RolePicker from "./RolePicker";
import LineGuess from './LineGuess';
import {array} from "prop-types";

import { Map, List, fromJS } from 'immutable';

export interface AppProps {

}

export interface AppState {
    currentDialog: Dialog;
    userRoleLineIndex: number;
    userRole: string;
    userRoleLineNumbers: number[];
    mode: InteractionMode;
}

enum InteractionMode {
    LoadingData = "LOADING_DATA",
    ChoosingRole = "CHOOSING_ROLE",
    PracticingLines = "PRACTICING_LINES",
}


export class App extends React.Component<AppProps, AppState> {

    state: AppState = {
        currentDialog: {
            roles: ["No Role"],
            name: "",
            lines: [],
        },
        userRoleLineIndex: 0,
        userRole: "",
        userRoleLineNumbers: [],
        mode: InteractionMode.LoadingData,
    };

    async componentDidMount() {
        let responseBody = await fetch("http://localhost/dialogs/0/");
        let responseJson = await responseBody.json();

        this.setState((previousState: AppState) : object => {
            return {
                currentDialog: responseJson,
                mode: InteractionMode.ChoosingRole,
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
     * Given a dialog and a role, returns an array of the line numbers that the role has in the dialog.
     *
     * @param dialog {Dialog} A dialog.
     * @param role {string} The name of a role that is present in the dialog.
     *
     * @return {number[]} An array of line numbers of the lines that are assigned to the given role in the dialog.
     */
    calculateUserLineNumbers(dialog: Dialog, role: string): number[] {
        let userRoleLines: LineData[] = dialog.lines.filter((line: LineData) => {
            return (line.role === role);
        });

        return userRoleLines.map((line: LineData) => {
            return line.key;
        });
    }

    addGuessToCurrentLineAndIncrementLineNumber = (lineGuess: string) => {
        this.setState((previousState) => {
            const currentUserRoleLineNumber = previousState.userRoleLineNumbers[this.state.userRoleLineIndex];
            const currentUserRoleLine = previousState.currentDialog.lines[currentUserRoleLineNumber];

            const newDialog = {
              ...previousState.currentDialog
            };

            const newLine: LineData = {
                text: currentUserRoleLine.text,
                guess: lineGuess,
                role: currentUserRoleLine.role,
                key: currentUserRoleLine.key,
            };

            newDialog.lines[currentUserRoleLineNumber] = newLine;

            return {
                currentDialog: newDialog,
                userRoleLineIndex: previousState.userRoleLineIndex + 1,
            };
        });
    };

    render() {
        switch (this.state.mode) {
            case InteractionMode.LoadingData:
                return <p data-testid={"loading-message"}>Waiting for the dialog to load...</p>;
            case InteractionMode.ChoosingRole:
                return (
                  <RolePicker
                    roles={this.state.currentDialog.roles}
                    setUserRoleAndChangeMode={this.setUserRoleAndChangeMode}
                  />
                );
            case InteractionMode.PracticingLines:
                const currentUserRoleLineNumber = this.state.userRoleLineNumbers[this.state.userRoleLineIndex];
                const currentUserRoleLine = this.state.currentDialog.lines[currentUserRoleLineNumber];
                return (
                  <div>
                    <ul data-testid={"lines"} >
                        {this.state.currentDialog.lines.filter((lineData: LineData) => {
                            return this.state.mode === InteractionMode.PracticingLines &&
                              lineData.key < currentUserRoleLineNumber
                        }).map((lineData: LineData) => {
                            return (
                              <Line
                                key={lineData.key}
                                text={lineData.text}
                                guess={lineData.guess}
                                role={lineData.role}
                              />
                            );
                        })}
                    </ul>
                    <LineGuess lineToGuess={currentUserRoleLine} addLineGuessToLastLine={this.addGuessToCurrentLineAndIncrementLineNumber} />
                  </div>
                );
        }
    }



}
