import React from 'react';
import './App.css';

import { testDialog } from "./data/test-dialog";
import Dialog from "./types/Dialog";
import LineData from "./types/LineData";
import Line from "./Line";
import Button from "./Button";

interface Props {

}

interface State {
    currentDialog: Dialog;
    userRoleLineIndex: number;
    userRole: string;
    userRoleLineNumbers: number[];
}


export default class App extends React.Component<Props, State> {

    state: State = {
        currentDialog: {
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

    componentDidMount(): void {
        this.setState((previousState: State) : object => {
            return {
                currentDialog: testDialog,
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
