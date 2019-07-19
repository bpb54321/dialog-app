import React, {ChangeEvent} from 'react';
import Role from "./types/Role";

interface Props {
    roles: Role[];
    setUserRoleAndChangeMode: (role: Role) => void;
}

interface State {
    role: Role;
}

export default class RolePicker extends React.Component<Props, State> {

    state: State;

    constructor(props: Props) {
      super(props);

      this.state = {
        role: {
          id: "",
          name: "",
        },
      };

      if (this.props.roles.length > 0) {
        this.state.role = this.props.roles[0];
      }
    }

    handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const selectedOption = event.target.selectedOptions[0];
      this.setState({
            role: {
              id: selectedOption.value,
              name: selectedOption.text,
            },
        });
    };

    render() {
        return (
            <form data-testid={"role-picker"}
                  onSubmit={(event) => {
                      event.preventDefault();
                      this.props.setUserRoleAndChangeMode(this.state.role);
                  }}>
                <h2>Role Picker</h2>
                <label htmlFor="role-picker__select">Available Roles</label>
                <select
                    name="role"
                    id="role-picker__select"
                    data-testid={"role-picker__select"}
                    value={this.state.role.id}
                    onChange={this.handleChange}
                >
                    {this.props.roles.map((role: Role, index: number) => {
                        return <option key={index} value={role.id}>{role.name}</option>
                    })}
                </select>
                <input type={"submit"} data-testid={"role-picker__submit"} value={"Confirm Role Selection"} />
            </form>
        );
    }
}
