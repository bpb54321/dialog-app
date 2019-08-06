import React from 'react';
import {Dialog, ShallowDialog} from "../types/Dialog";
import fetchData from "../utils/fetch-data";
import {AddNewDialogForm} from "../components/AddNewDialogForm";
import {DialogWithUpdateAndDelete} from "../components/DialogWithUpdateAndDelete";
import {GlobalState} from "../contexts/GlobalStateContext";

export interface DialogListPageProps {
  context: GlobalState;
  match: any;
  location: any;
  history: any;
}

interface State {
  errorMessage: string;
  dialogs: ShallowDialog[];
}

const dialogsQuery =
  `
    query DialogsQuery {
        dialogs {
          name
          id
          languageCode
        }
    }
  `;

export default class DialogListPage extends React.Component<DialogListPageProps, State> {

  state = {
    errorMessage: "",
    dialogs: [],
  };

  async componentDidMount() {

    try {
      const dialogs = await fetchData(
        dialogsQuery, {}, "dialogs", this.props.context
      );

      this.setState({
        dialogs
      });

    } catch(error) {

      this.setState({
        errorMessage: error.message,
      });

    }
  }

  addDialogToState = (dialog: ShallowDialog) => {
    this.setState((previousState: State) => {
      return {
        dialogs: [...previousState.dialogs, dialog],
      };
    });
  };

  removeDialogFromList = (dialogId: string) => {
    this.setState((previousState) => {
      const newDialogs = previousState.dialogs.filter((dialog) => {
        return dialog.id !== dialogId;
      });

      return {
        dialogs: newDialogs
      };
    });
  };

  render() {
    return (
      <div>
        <h1>Dialogs</h1>
        <ul>
          {
            this.state.dialogs.map((dialog: Dialog) => {
              return (
                <DialogWithUpdateAndDelete
                  key={dialog.id}
                  dialog={dialog}
                  deleteDialogInDialogList={this.removeDialogFromList}
                  match={this.props.match}
                />
              );
            })
          }
        </ul>
        <AddNewDialogForm addDialogToDialogList={this.addDialogToState}/>
      </div>
    );
  }
}
