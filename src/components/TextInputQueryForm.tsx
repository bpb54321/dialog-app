import React, {ChangeEvent} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalConsumer, GlobalContextObject} from "../contexts/GlobalContext";
import {CreationMode} from "../types/CreationMode";

interface Props {
  query: string;
  queryVariableDefaults: {[index: string]: string|number};
  queryVariableModifiedByTextInput: string;
  addValueToParentState: (value: any) => void;
  placeholderText: string;
}

interface State {
  queryVariables?: {[index: string]: string|number};
  value?: string;
  errorMessage?: string;
  mode?: CreationMode;
}

export default class TextInputQueryForm extends React.Component<Props, State> {

  state = {
    queryVariables: this.props.queryVariableDefaults,
    mode: CreationMode.Standby,
    errorMessage: "",
  };

  createNewEntity = async (context: GlobalContextObject) => {
    this.setState({
      mode: CreationMode.Creating_Dialog,
    });

    try {

      const result = await fetchData(
        this.props.query, this.state.queryVariables,
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
      queryVariables: {
        ...this.state.queryVariables,
        [event.target.id]: event.target.value,
      }
    });
  };

  render() {
    if (this.props.queryVariableModifiedByTextInput in this.state.queryVariables) {
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
                      <label htmlFor="dialogName">{this.props.queryVariableModifiedByTextInput}</label>
                      <input
                        id={this.props.queryVariableModifiedByTextInput}
                        onChange={this.handleInputChange}
                        placeholder={this.props.placeholderText}
                        type="text"
                        value={this.state.queryVariables[this.props.queryVariableModifiedByTextInput]}
                      />
                      <input type="submit" value={`Add New ${this.props.queryVariableModifiedByTextInput}`}/>
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
    } else {
      return (
        <p>
          Coding error: The query variable {this.props.queryVariableModifiedByTextInput} was not provided with a
          default value.
        </p>
      );
    }

  }
}
