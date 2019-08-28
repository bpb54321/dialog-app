import React from 'react';
import Role from "../types/Role";

interface Props {
  text: string;
  key: number;
  guess?: string;
  role: Role;
  showNext?: boolean;
  incrementLine: () => void;
}

export const Line : React.FunctionComponent<Props> = ({role, guess = null, text, showNext = false, incrementLine}) => {
  return (
    <li data-testid={"line"}>
      <span>{role.name}</span>
      {
        guess ?
        <div>
          <span>Guess: </span>
          <span>{guess}</span>
        </div> :
        null
      }
      <div>
        <span>Line text: </span>
        <span>{text}</span>
      </div>
      {
        showNext ?
          <button
            onClick={incrementLine}
          >
            Next Line
          </button> :
          null
      }
    </li>
  );
};
