import React, {ChangeEvent} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalConsumer, GlobalContextObject} from "../contexts/GlobalContext";
import {CreationMode} from "../types/CreationMode";

interface Props {
  query: string;
  queryVariableNames: string[];
  addValueToParentState: (value: any) => void;
  placeholderText: string;
}

interface State {
  value?: string;
  errorMessage?: string;
  mode?: CreationMode;
}

export default class TextInputQueryForm extends React.Component<Props, State> {

  state = {
    value: "",
    mode: CreationMode.Standby,
    errorMessage: "",
  };

  createNewEntity = async (context: GlobalContextObject) => {
    this.setState({
      mode: CreationMode.Creating_Dialog,
    });

    try {

      const result = await fetchData(
        this.props.query, this.props.queryVariableNames, [this.state.value],
        "createRole", context
      );

      this.setState({
        mode: CreationMode.Standby,
        value: "",
      });

      this.props.addValueToParentState(result);

    } catch(error) {

      this.setState({
        mode: CreationMode.Standby,
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
          return (
            <>
              {
                (this.state.mode === CreationMode.Standby)
                ?
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    await this.createNewEntity(context);
                  }}
                >
                  <label htmlFor="dialogName">Name</label>
                  <input
                    id={"value"}
                    onChange={this.handleInputChange}
                    placeholder={this.props.placeholderText}
                    type="text"
                    value={this.state.value}
                  />
                  <input type="submit" value={"Add New Role"}/>
                </form>
                :
                <p>Loading...</p>
              }
              {
                this.state.errorMessage
                ?
                <p>{this.state.errorMessage}</p>
                :
                null
              }
            </>
          );
        }}
      </GlobalConsumer>
    );
  }
}
