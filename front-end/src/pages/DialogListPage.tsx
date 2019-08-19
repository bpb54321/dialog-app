import React from 'react';
import {ShallowDialog} from "../types/Dialog";
import fetchData from "../utils/fetch-data";
import {AddNewDialogForm} from "../components/AddNewDialogForm";
import {GlobalState} from "../contexts/GlobalStateContext";
import {DialogList} from "../components/DialogList";
import {LoadingSpinner} from "../components/LoadingSpinner";

export interface DialogListPageProps {
  context: GlobalState;
  match: any;
  location: any;
  history: any;
}

interface State {
  isLoadingDialogs: boolean;
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
    isLoadingDialogs: true,
    errorMessage: "",
    dialogs: [],
  };

  async componentDidMount() {

    try {
      const dialogs = await fetchData(
        dialogsQuery, {}, "dialogs", this.props.context
      );

      this.setState({
        dialogs,
        isLoadingDialogs: false,
      });


    } catch(error) {

      this.setState({
        errorMessage: error.message,
        isLoadingDialogs: false,
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
        {
          this.state.isLoadingDialogs ?
          <LoadingSpinner/> :
          <DialogList
            match={this.props.match}
            removeDialogFromList={this.removeDialogFromList}
            dialogs={this.state.dialogs}
          />
        }
        <AddNewDialogForm addDialogToDialogList={this.addDialogToState}/>
      </div>
    );
  }
}
