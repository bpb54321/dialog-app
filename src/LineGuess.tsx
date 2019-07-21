import React, {ChangeEvent, FormEvent} from 'react';
import "./LineGuess.css";
import SpeechInputButton from "./SpeechInputButton";
import {SpeechRecognitionState} from "./types/SpeechRecognitionState";
import Role from "./types/Role";

interface Props {
    userRole: Role;
    addLineGuessToLastLine: (lineGuess: string) => void;
    speechRecognition: any;
}

interface State {
  guess: string;
  speechRecognitionState: SpeechRecognitionState;
}

export default class LineGuess extends React.Component<Props, State> {

  state: State = {
    guess: "",
    speechRecognitionState: SpeechRecognitionState.Stopped,
  };

  componentDidMount(): void {
    this.props.speechRecognition.onresult = (event: any) => {
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

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    this.props.speechRecognition.stop();

    this.props.addLineGuessToLastLine(this.state.guess);

    this.setState({
      guess: "",
      speechRecognitionState: SpeechRecognitionState.Stopped,
    });
  };

  updateSpeechRecognitionState = () => {
    if (this.state.speechRecognitionState === SpeechRecognitionState.Stopped) {
      this.props.speechRecognition.start();
      this.setState({speechRecognitionState: SpeechRecognitionState.Started});
    } else {
      this.props.speechRecognition.stop();
      this.setState({speechRecognitionState: SpeechRecognitionState.Stopped});
    }
  };

  render() {
      return (
          <form
            data-testid={"line-guess"}
            onSubmit={this.handleSubmit}
          >
              <label htmlFor="line-guess__text-input" data-testid={"line-guess__label"}>Line Guess</label>
              <input
                className={"line-guess__text-input"}
                data-testid={"line-guess__text-input"}
                id={"line-guess__text-input"}
                onChange={this.handleInputChange}
                placeholder={`Text of the next line for ${this.props.userRole.name}`}
                type="text"
                value={this.state.guess}
              />
              <SpeechInputButton
                updateSpeechRecognitionState={this.updateSpeechRecognitionState}
                speechRecognitionState={this.state.speechRecognitionState}
              />
              <input type="submit" data-testid={"line-guess__submit"} value={"Submit Guess"}/>
          </form>
      );
  }
}
