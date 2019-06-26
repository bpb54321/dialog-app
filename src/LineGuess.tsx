import React, {ChangeEvent} from 'react';
import LineData from "./types/LineData";
import {testDialog} from "./data/test-dialog";

interface Props {
    lineToGuess: LineData;
    addLineGuessToLastLine: (lineGuess: string) => void;
}

interface State {
  guess: string;
}

export default class LineGuess extends React.Component<Props, State> {

    state: State = {
      guess: "",
    };

    handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
      this.setState({
        guess: event.target.value,
      });
    }

    render() {
        return (
            <form
              data-testid={"line-guess"}
              onSubmit={(event) => {
                event.preventDefault();
                this.props.addLineGuessToLastLine(this.state.guess);
              }}
            >
                <label htmlFor="line-guess__text-input" data-testid={"line-guess__label"}>Line Guess</label>
                <input
                  data-testid={"line-guess__text-input"}
                  id={"line-guess__text-input"}
                  onChange={this.handleInputChange}
                  placeholder={`Text of the next line for ${this.props.lineToGuess.role}`}
                  type="text"
                  value={this.state.guess}
                />
                <input type="submit" data-testid={"line-guess__submit"} value={"Submit Guess"}/>
            </form>
        );
    }
}
