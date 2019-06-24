import React from 'react';

interface Props {
    text: string;
    key: number;
}

interface State {
    name: string;
}

export default class Line extends React.Component<Props, State> {
    render() {
        return (<li data-testid={"line"}>{this.props.text}</li>);
    };
}
