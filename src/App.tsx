import React from 'react';
import './App.css';

import { auMarche } from "./data/au-marche-dialog";
import Dialog from "./types/Dialog";
import LineData from "./types/LineData";
import Line from "./Line";

interface Props {}

interface State {
    currentDialog: Dialog;
    currentLineNumber: number;
}


export default class App extends React.Component<Props, State> {

    state: State = {
        currentDialog: {
            lines: [],
        },
        currentLineNumber: 0,
    };

    componentDidMount(): void {

        this.setState((previousState: State) : object => {
            return {
                currentDialog: auMarche,
            };
        });
    }

    render() {
        return (
            <div className="App">
                <ul>
                    {this.state.currentDialog.lines.map((lineData: LineData) => {
                        if (lineData.key <= this.state.currentLineNumber) {
                            return (<Line key={lineData.key} text={lineData.text} />);
                        }
                    })}
                </ul>
            </div>
        );
    }
}
