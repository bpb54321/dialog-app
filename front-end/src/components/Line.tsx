import React from 'react';
import Role from "../types/Role";

interface Props {
    text: string;
    key: number;
    guess?: string;
    role: Role;
    showNext?: boolean;
}

export const Line : React.FunctionComponent<Props> = ({role, guess = null, text, showNext = false}) => {
    return (
      <li data-testid={"line"}>
        <span>{role.name}</span>
        {guess ? <div>Guess: {guess}</div> : null}
        <div>Line text: {text}</div>
          {showNext ? <button>Next Line</button> : null}
      </li>
    );
};
