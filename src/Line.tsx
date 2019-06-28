import React from 'react';

interface Props {
    text: string;
    key: number;
    guess?: string;
}

interface State {
    name: string;
}

export default class Line extends React.Component<Props, State> {
    render() {
        return (
          <li data-testid={"line"}>
              {this.props.guess ? <div>Guess: {this.props.guess}</div> : null}
              <div>Line text: {this.props.text}</div>
          </li>
        );
    };
}
