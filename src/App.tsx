import React from 'react';
import './App.css';

interface Props {}

interface State {
    name: string;
}

export default class App extends React.Component<Props, State> {

    state: State = {
        name: "viewers",
    };

    render() {
        return (
            <div className="App">
                <span>Hello, {this.state.name}!</span>
            </div>
        );
    }
}
