import React from 'react';
import LineData from "./types/LineData";

interface Props {
    lineToGuess: LineData;
}

interface State {
}

export default class LineGuess extends React.Component<Props, State> {

    state = {};

    render() {
        return (
            <div data-testid={"line-guess"}>
                {`${this.props.lineToGuess.role}, Line ${this.props.lineToGuess.key} Guess`}
            </div>
        );
    }
}
