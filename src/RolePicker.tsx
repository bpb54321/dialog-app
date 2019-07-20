import React, {ChangeEvent, FormEvent} from 'react';
import Role from "./types/Role";
import fetchData from "./utils/fetch-data";
import LineData from "./types/LineData";
import {GlobalContextObject} from "./types/GlobalContextObject";

interface Props {
  history: any;
  match: any;
  context: GlobalContextObject;
}

interface State {
  possibleRoles: Role[];
  chosenRole: Role;
  errorMessage: string;
}

export default class RolePicker extends React.Component<Props, State> {

  state = {
    possibleRoles: [],
    chosenRole: {
      id: "",
      name: "",
    },
    errorMessage: "",
  };

  componentDidMount() {
    const {data} = this.props.context;
    const {
      params: {
        dialogId
      }
    } = this.props.match;

    const singleDialogQuery = `
      query {
        dialog(id: "${dialogId}") {
          name
          lines {
            role {
              id
              name
            }
          }
        }
      }
    `;

    fetchData(singleDialogQuery, data.token, data.apiEndpoint, (body) => {

      // Collect the ids of all the roles that are contained in the lines of the dialog
      const rolesInDialog: Role[] = body.data.dialog.lines.reduce((accumulator: Role[], line: LineData) => {
        let roleAlreadyInArray = accumulator.find((role: Role) => {
          return line.role.id === role.id;
        });

        if (!roleAlreadyInArray) {
          accumulator.push(line.role)
        }

        return accumulator;
      }, ([] as Role[]));

      this.setState({
        possibleRoles: rolesInDialog,
        chosenRole: rolesInDialog[0],
      });

    }, (errorMessage) => {
      this.setState({
        errorMessage: errorMessage
      });
    });

  }

  handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.selectedOptions[0];
    this.setState({
      chosenRole: {
        id: selectedOption.value,
        name: selectedOption.text,
      },
    });
  };

  handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    this.props.context.actions.setChosenRole(this.state.chosenRole);

    // Navigate to practice page for this dialog
    const currentUrl = this.props.match.url;
    const newUrl = currentUrl.replace("choose-role", "practice");
    this.props.history.push(newUrl);
  };

  render() {
    return (
      <>
        <form data-testid={"role-picker"}
              onSubmit={this.handleSubmit}>
          <h2>Role Picker</h2>
          <label htmlFor="role-picker__select">Available Roles</label>
          <select
            name="role"
            id="role-picker__select"
            data-testid={"role-picker__select"}
            value={this.state.chosenRole.id}
            onChange={this.handleChange}
          >
            {this.state.possibleRoles.map((role: Role, index: number) => {
              return <option key={index} value={role.id}>{role.name}</option>
            })}
          </select>
          <input type={"submit"} data-testid={"role-picker__submit"} value={"Confirm Role Selection"}/>
        </form>
        {this.state.errorMessage ? <p>{this.state.errorMessage}</p> : null}
      </>
    );
  }
}
