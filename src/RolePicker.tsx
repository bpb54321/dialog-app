import React, {ChangeEvent, SyntheticEvent} from 'react';

interface Props {
    roles: string[];
    onSubmit: (role: string) => void
}

interface State {
    role: string;
}

export default class RolePicker extends React.Component<Props, State> {

    state: State = {
        role: '',
    };

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
                      this.props.onSubmit(this.state.role);
                  }}>
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
                <input type={"submit"} data-testid={"role-picker__submit"} />
            </form>
        );
    }
}