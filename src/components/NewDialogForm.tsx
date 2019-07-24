import React, {ChangeEvent, FormEvent} from 'react';
import SpeechInputButton from "../SpeechInputButton";
import fetchData from "../utils/fetch-data";
import {GlobalConsumer, GlobalContextObject, GlobalProvider} from "../contexts/GlobalContext";

interface Props {
  getAllDialogs: () => Promise<void>;
}

interface State {
  name?: string;
  errorMessage?: string;
  mode?: Mode;
}

enum Mode {
  Creating_Dialog =  "CREATING_DIALOG",
  Standby = "STANDBY",
}

export default class NewDialogForm extends React.Component<Props, State> {

  state = {
    name: "",
    mode: Mode.Standby,
    errorMessage: "",
  };

  createNewDialog = async (context: GlobalContextObject) => {
    this.setState({
      mode: Mode.Creating_Dialog,
    });

    const query = `
      mutation {
          createDialog(name: "${this.state.name}") {
            name
            id
          }
      }
    `;

    try {
      await fetchData(query, "createDialog", context);
      this.setState({
        mode: Mode.Standby,
        name: "",
      });
      await this.props.getAllDialogs();
    } catch(error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  };

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  };

  render() {
    return (
      <GlobalConsumer>
        {(context: GlobalContextObject) => {
          if (this.state.mode === Mode.Standby) {
            return (
              <form
                onSubmit={ async (event) => {
                  event.preventDefault();
                  await this.createNewDialog(context);
                }}
              >
                <label htmlFor="dialogName">Name</label>
                <input
                  id={"name"}
                  onChange={this.handleInputChange}
                  placeholder={"New Dialog"}
                  type="text"
                  value={this.state.name}
                />
                <input type="submit" value={"Add New Dialog"}/>
              </form>
            );
          } else {
            return (
              <p>Creating dialog...</p>
            );
          }
        }}
      </GlobalConsumer>
    );
  }
}
