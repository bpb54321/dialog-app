import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import {App} from './App';
import {GlobalProvider} from "./contexts/GlobalStateContext";

declare let webkitSpeechRecognition: {
  new(): SpeechRecognition;
};

ReactDOM.render(
  <GlobalProvider
    speechRecognition={new webkitSpeechRecognition()}
    children={
      <App/>
    }
  />, document.getElementById('root'));
