import React from 'react';
import Dialog from "./types/Dialog";

interface Props {
  dialogs: Dialog[];
}

interface State {
}

export default class DialogList extends React.Component<Props, State> {

  state = {};

  render() {
    return (
      <ul>
        {
          this.props.dialogs.map((dialog: Dialog) => {
            return <li key={dialog.id}>{dialog.name}</li>;
          })
        }
      </ul>
    );
  }
}
