import React from 'react';
import {GlobalContextObject} from "../contexts/GlobalContext";

interface Props {
  context: GlobalContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
}

export default class DialogEditPage extends React.Component<Props, State> {

  state = {};

  render() {
    return (
      <div>This is the dialog edit page.</div>
    );
  }
}
