import React, {CSSProperties} from 'react';
import './App.css';

import Dialog from "./types/Dialog";
import LineData from "./types/LineData";
import Line from "./Line";
import Button from "./Button";

import axios from "axios";
import RolePicker from "./RolePicker";

export interface AppProps {

}

export interface AppState {
    currentDialog: Dialog;
    userRoleLineIndex: number;
    userRole: string;
    userRoleLineNumbers: number[];
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
    };

    incrementUserRoleLineIndex: () => void = () => {
        // this.setState((previousState) => {
        //     return {
        //         userRoleLineIndex: previousState.userRoleLineIndex + 1,
        //     };
        // })
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

    getUserRoleLineNumbers(): number[] {
        return this.state.userRoleLineNumbers;
    }

    async componentDidMount() {
        let responseBody = await fetch("http://localhost/dialogs/0/");
        let responseJson = await responseBody.json();

        this.setState((previousState: AppState) : object => {
            return {
                currentDialog: responseJson,
            };
        });
    }

//     userRoleLineNumbers: testDialog.lines.filter((line: LineData) => {
//     if (line)
// }).map((line: LineData, index: number) => {
//     return 3;
// })



    render() {
        return (
            <div className="App">
                <RolePicker roles={this.state.currentDialog.roles}/>
                <ul data-testid={"lines"} style={{display: "none"}}>
                    {this.state.currentDialog.lines.map((lineData: LineData) => {
                        if (lineData.key <= this.state.userRoleLineIndex ||
                            lineData.role === this.state.userRole) {
                            return (<Line key={lineData.key} text={lineData.text} />);
                        } else {
                            return "";
                        }
                    })}
                </ul>
                <Button text={"Show Next Line"} handleClick={this.incrementUserRoleLineIndex}/>
            </div>
        );
    }



}
