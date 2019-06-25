import React from 'react';
import LineData from "./types/LineData";
import {testDialog} from "./data/test-dialog";

interface Props {
    lineToGuess: LineData;
}

interface State {
}

export default class LineGuess extends React.Component<Props, State> {

    state = {};

    render() {
        return (
            <form data-testid={"line-guess"}>
                <label htmlFor="line-guess__text-input" data-testid={"line-guess__label"}>Line Guess</label>
                <input
                  type="text"
                  data-testid={"line-guess__text-input"}
                  id={"line-guess__text-input"}
                  placeholder={`Text of the next line for ${this.props.lineToGuess.role}`}
                />g
                <input type="submit" data-testid={"line-guess__submit"} value={"Submit Guess"}/>
            </form>
        );
    }
}
