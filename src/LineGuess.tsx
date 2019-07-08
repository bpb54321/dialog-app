import React, {ChangeEvent} from 'react';
import "./LineGuess.css";
import ChromeWindow from "./types/ChromeWindow";

interface Props {
    userRole: string;
    addLineGuessToLastLine: (lineGuess: string) => void;
    speechRecognition: SpeechRecognition;
}

interface State {
  guess: string;
}

export default class LineGuess extends React.Component<Props, State> {

  state: State = {
    guess: "",
  };

  componentDidMount(): void {
    this.props.speechRecognition.onresult = (event: SpeechRecognitionEvent) => {
      let results: SpeechRecognitionResultList = event.results;

      let result_phrase = "";
      for (let i = 0; i < results.length; i++) {
        result_phrase += results[i][0].transcript;
      }

      this.setState({
        guess: result_phrase,
      });
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      guess: event.target.value,
    });
  };

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
              <button>Start Speech Input</button>
              <input type="submit" data-testid={"line-guess__submit"} value={"Submit Guess"}/>
          </form>
      );
  }
}
