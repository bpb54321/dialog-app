import React from 'react';

interface Props {
}

interface State {
}

export default class RolePicker extends React.Component<Props, State> {

    state = {};

    render() {
        return (
            <form data-testid={"role-picker"}></form>
        );
    }
}