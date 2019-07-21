import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import {App} from './App';

declare let webkitSpeechRecognition: {
  new(): SpeechRecognition;
};

ReactDOM.render(<App speechRecognition={new webkitSpeechRecognition()}/>, document.getElementById('root'));
