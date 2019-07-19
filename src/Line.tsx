import React from 'react';
import Role from "./types/Role";

interface Props {
    text: string;
    key: number;
    guess?: string;
    role: Role;
}

interface State {
    name: string;
}

export default class Line extends React.Component<Props, State> {
    render() {
        return (
          <li data-testid={"line"}>
            <span>{this.props.role}</span>
            {this.props.guess ? <div>Guess: {this.props.guess}</div> : null}
            <div>Line text: {this.props.text}</div>
          </li>
        );
    };
}
