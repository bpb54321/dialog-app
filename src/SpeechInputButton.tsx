import React from 'react';

interface Props {
  speechRecognition: any;
}

interface State {
}

export default class SpeechInputButton extends React.Component<Props, State> {

  state = {};

  handleToggleSpeechInput = () => {
    this.props.speechRecognition.start();
  };

  render() {
    return (
      <button onClick={this.handleToggleSpeechInput}>Start Speech Input</button>
    );
  }
}
