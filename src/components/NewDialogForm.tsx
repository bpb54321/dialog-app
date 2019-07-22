import React, {ChangeEvent, FormEvent} from 'react';
import SpeechInputButton from "../SpeechInputButton";
import fetchData from "../utils/fetch-data";
import {GlobalConsumer, GlobalContextObject, GlobalProvider} from "../contexts/GlobalContext";

interface Props {
}

interface State {
  dialogName?: string;
  errorMessage?: string;
}

export default class MyComponent extends React.Component<Props, State> {

  state = {
    dialogName: "",
    errorMessage: "",
  };

  createNewDialogAndRedirect = (context: GlobalContextObject) => {
    const {data} = context;

    const query = `
      mutation {
          createDialog(name: "Fake Name") {
            name
            id
          }
      }
    `;

    fetchData(query, data.token, data.apiEndpoint, (body) => {
      console.log(body);
    }, (errorMessage) => {
      this.setState({
        errorMessage: errorMessage
      });
    });
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
          return (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                this.createNewDialogAndRedirect(context);
              }}
            >
              <label htmlFor="dialogName">Name</label>
              <input
                id={"dialogName"}
                onChange={this.handleInputChange}
                placeholder={"New Dialog"}
                type="text"
                value={this.state.dialogName}
              />
              <input type="submit" value={"Add New Dialog"}/>
            </form>
          );
        }}
      </GlobalConsumer>
    );
  }
}
