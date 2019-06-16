import * as React from "react";

interface Props {
    text: string;
    handleClick: () => void;
}

export default class Button extends React.Component<Props> {
    render(): React.ReactElement {
        return (
            <button
                onClick={this.props.handleClick}
            >
                {this.props.text}
            </button>
        );
    }
}