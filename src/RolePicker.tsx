import React from 'react';

interface Props {
    roles: string[];
}

interface State {
}

export default class RolePicker extends React.Component<Props, State> {

    state = {};

    render() {
        return (
            <form data-testid={"role-picker"}>
                <select name="role" id="role-picker__select" data-testid={"role-picker__select"}>
                    {this.props.roles.map((role: string, index: number) => {
                        return <option key={index}>{role}</option>
                    })}
                </select>
                <input type={"submit"} data-testid={"role-picker__submit"}/>
            </form>
        );
    }
}