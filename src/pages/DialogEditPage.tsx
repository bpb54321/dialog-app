import React from 'react';
import {GlobalContextObject} from "../contexts/GlobalContext";
import queryEntireDialog from "../utils/queryEntireDialog";
import Dialog from "../types/Dialog";
import Role from "../types/Role";
import Line from "../Line";
import LineData from "../types/LineData";

interface Props {
  context: GlobalContextObject;
  match: any;
  location: any;
  history: any;
}

interface State {
  dialog: Dialog;
  loading: boolean;
  errorMessage: string;
}

export default class DialogEditPage extends React.Component<Props, State> {

  state = {
    dialog: {
      id: "",
      name: "",
      roles: [],
      lines: [],
    },
    loading: true,
    errorMessage: "",
  };

  async componentDidMount(): Promise<void> {
    const {context} = this.props;
    const {dialogId} = this.props.match.params;
    try {
      const dialog = await queryEntireDialog(context, dialogId);
      this.setState({
        dialog,
        loading: false,
      });
    } catch(error) {
      this.setState({
        errorMessage: error.message,
      });
    }
  }

  render() {
    return (
      <>
        {
          this.state.loading
          ?
            <p>Loading dialog...</p>
          :
            <div>
              <h2>{this.state.dialog.name}</h2>
              <ul>
                {this.state.dialog.roles.map((role: Role) => {
                    return (
                      <li>{role.name}</li>
                    );
                })}
              </ul>
              <ul>
                {this.state.dialog.lines.map((line: LineData) => {
                  return (
                    <li>
                      <div>{line.number}</div>
                      <div>{line.role}</div>
                      <div>{line.text}</div>
                    </li>
                  );
                })}
              </ul>
            </div>
        }
      </>

    );
  }
}
