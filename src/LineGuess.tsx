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
            <form data-testid={"line-guess"}>
                <label htmlFor="line-guess__text-input" data-testid={"line-guess__label"}></label>
                <input type="text" data-testid={"line-guess__text-input"} id={"line-guess__text-input"} />
                {/*{`${this.props.lineToGuess.role}, Line ${this.props.lineToGuess.key} Guess`}*/}
                <input type="submit" data-testid={"line-guess__submit"} value={"Guess"}/>
            </form>
        );
    }
}
