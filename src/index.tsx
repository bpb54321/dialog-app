import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import './index.css';
import {App} from './App';
import {GlobalProvider} from "./contexts/GlobalStateContext";

ReactDOM.render(
  <GlobalProvider
    children={
      <App/>
    }
  />, document.getElementById('root'));
