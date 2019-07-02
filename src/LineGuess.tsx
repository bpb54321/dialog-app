import React, {ChangeEvent} from 'react';
import "./LineGuess.css";

interface Props {
    userRole: string;
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
                this.setState({
                  guess: "",
                });
              }}
            >
                <label htmlFor="line-guess__text-input" data-testid={"line-guess__label"}>Line Guess</label>
                <input
                  className={"line-guess__text-input"}
                  data-testid={"line-guess__text-input"}
                  id={"line-guess__text-input"}
                  onChange={this.handleInputChange}
                  placeholder={`Text of the next line for ${this.props.userRole}`}
                  type="text"
                  value={this.state.guess}
                />
                <label htmlFor="audio-file">Record audio</label>
                <input type="file" accept="audio/*" capture={"user"} id={"audio-file"}/>
                <input type="submit" data-testid={"line-guess__submit"} value={"Submit Guess"}/>
            </form>
        );
    }
}
