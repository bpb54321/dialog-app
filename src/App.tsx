import React from 'react';
import './App.css';

import Dialog from "./types/Dialog";
import LineData from "./types/LineData";
import Line from "./Line";
import Button from "./Button";

import axios from "axios";

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

    async componentDidMount() {
        let response = await axios.get("http://localhost/dialogs/0/");

        this.setState((previousState: AppState) : object => {
            return {
                currentDialog: response.data.dialogs[0]
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
                <ul>
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
