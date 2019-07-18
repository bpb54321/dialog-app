import React from 'react';
import {UserContextObject} from "../types/UserContextObject";

interface Props {
  context: UserContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
}

export default class ChooseRolePage extends React.Component<Props, State> {

  state = {};

  render() {

    const {
      params: {
        dialogId
      }
    } = this.props.match;

    return (
      <div>
        <h1>The Choose Role Page</h1>
        <p>{dialogId}</p>
      </div>
    );
  }
}
