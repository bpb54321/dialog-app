import React, {SyntheticEvent} from 'react';
import {SpeechRecognitionState} from "./types/SpeechRecognitionState";

interface Props {
  updateSpeechRecognitionState: () => void;
  speechRecognitionState: SpeechRecognitionState;
}

interface State {

}

export default class SpeechInputButton extends React.Component<Props, State> {

  handleToggleSpeechInput = (event: SyntheticEvent) => {
    event.preventDefault();

    this.props.updateSpeechRecognitionState();
  };

  render() {
    return (
      <button onClick={this.handleToggleSpeechInput}>
        {
          this.props.speechRecognitionState === SpeechRecognitionState.Stopped
            ? "Start Speech Input"
            : "Stop Speech Input"
        }
      </button>
    );
  }
}
