import React, {ChangeEvent, SyntheticEvent} from 'react';

interface Props {
    roles: string[];
    setUserRoleAndChangeMode: (role: string) => void
}

interface State {
    role: string;
}

export default class RolePicker extends React.Component<Props, State> {

    state: State;

    constructor(props: Props) {
      super(props);

      this.state = {
        role: '',
      };

      if (this.props.roles.length > 0) {
        this.state.role = this.props.roles[0];
      }
    }

    handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        this.setState({
            role: event.target.value,
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
                    value={this.state.role}
                    onChange={this.handleChange}
                >
                    {this.props.roles.map((role: string, index: number) => {
                        return <option key={index}>{role}</option>
                    })}
                </select>
                <input type={"submit"} data-testid={"role-picker__submit"} value={"Confirm Role Selection"} />
            </form>
        );
    }
}
