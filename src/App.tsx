import React from 'react';
import './App.css';

import { testDialog } from "./data/test-dialog";
import Dialog from "./types/Dialog";
import LineData from "./types/LineData";
import Line from "./Line";

interface Props {}

interface State {
    currentDialog: Dialog;
    currentUserLineNumber: number;
    userRole: string;
}


export default class App extends React.Component<Props, State> {

    state: State = {
        currentDialog: {
            lines: [],
        },
        currentUserLineNumber: 0,
        userRole: "",
    };

    componentDidMount(): void {
        this.setState((previousState: State) : object => {
            return {
                currentDialog: testDialog,
            };
        });
    }

    render() {
        return (
            <div className="App">
                <ul>
                    {this.state.currentDialog.lines.map((lineData: LineData) => {
                        if (lineData.key <= this.state.currentUserLineNumber) {
                            return (<Line key={lineData.key} text={lineData.text} />);
                        } else {
                            return "";
                        }
                    })}
                </ul>
            </div>
        );
    }
}
