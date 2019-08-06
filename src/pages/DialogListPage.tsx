import React from 'react';
import {ShallowDialog} from "../types/Dialog";
import fetchData from "../utils/fetch-data";
import {AddNewDialogForm} from "../components/AddNewDialogForm";
import {GlobalState} from "../contexts/GlobalStateContext";
import {WithLoadingSpinnerProps} from "../higher-order-components/withLoadingSpinner";
import {DialogList} from "../components/DialogList";

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

export default class DialogListPage extends React.Component<DialogListPageProps & Partial<WithLoadingSpinnerProps>, State> {

  state = {
    errorMessage: "",
    dialogs: [],
  };

  async componentDidMount() {

    try {
      const dialogs = await fetchData(
        dialogsQuery, {}, "dialogs", this.props.context
      );

      if (this.props.setIsLoading) {
        this.props.setIsLoading(false);
      }

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
        <DialogList
          match={this.props.match}
          removeDialogFromList={this.removeDialogFromList}
          dialogs={this.state.dialogs}
        />
        <AddNewDialogForm addDialogToDialogList={this.addDialogToState}/>
      </div>
    );
  }
}
