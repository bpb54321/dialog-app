import React from 'react';

enum ButtonText {
  StartSpeechInput = "Start Speech Input",
  StopSpeechInput = "Stop Speech Input",
}

interface Props {
  speechRecognition: any;
}

interface State {
  text: string;
}

export default class SpeechInputButton extends React.Component<Props, State> {

  state = {
    text: ButtonText.StartSpeechInput,
  };

  handleToggleSpeechInput = () => {
    if (this.state.text === ButtonText.StartSpeechInput) {
      this.props.speechRecognition.start();
      this.setState({text: ButtonText.StopSpeechInput});
    } else {
      this.props.speechRecognition.stop();
      this.setState({text: ButtonText.StartSpeechInput});
    }
  };

  render() {
    return (
      <button onClick={this.handleToggleSpeechInput}>
        {this.state.text}
      </button>
    );
  }
}
