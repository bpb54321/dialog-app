import React, {ChangeEvent, SyntheticEvent, useContext, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";
import LineData from "../types/LineData";
import Role from "../types/Role";

interface Props {
  line: LineData;
  rolesInDialog: Role[];
  deleteLineInDialog: (lineId: string) => void;
}

//region updateLineQuery
const updateLineQuery =
  `
    mutation UpdateLine($id: String!, $text: String, $roleId: String, $number: Int) {
      updateLine(id: $id, text: $text, roleId: $roleId, number: $number) {
        id
        text
        number
      }
    }
  `;
//endregion

//region deleteLineQuery
const deleteLineQuery =
  `
    mutation DeleteLine($id: String!) {
      deleteLine(id: $id)
    }
  `;
//endregion

export const LineWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [text, setText] = useState(props.line.text);
  const [number, setNumber] = useState(String(props.line.number));
  const [roleId, setRoleId] = useState(props.line.role.id);
  const [errorMessage, setErrorMessage] = useState("");

  const updateLine = async (queryVariables: {
      id: string;
      text?: string;
      roleId?: string;
      number?: number;
    }): Promise<void> => {

    try {
      await fetchData(updateLineQuery, queryVariables, "updateLine", context);
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  const deleteLine = async (): Promise<void> =>  {

    const queryVariables = {
      id: props.line.id,
    };

    try {
      const deletionWasSuccessful: boolean = await fetchData(
        deleteLineQuery, queryVariables, "deleteLine", context
      );

      if(deletionWasSuccessful) {
        props.deleteLineInDialog(props.line.id);
      } else {
        setErrorMessage(`There was a problem when attempting to delete the Line with id ${props.line.id}` +
          `and text ${text}`);
      }
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  return (
    <li>
      <form
        onSubmit={(event: SyntheticEvent) => {
          event.preventDefault();
        }}
      >
        <div>
          <label htmlFor={`line-role-${props.line.id}`}>Role</label>
          <select
            name="role"
            id={`line-role-${props.line.id}`}
            value={roleId}
            onChange={async (event: ChangeEvent<HTMLSelectElement>) => {
              setRoleId(event.target.value);
              await updateLine({
                id: props.line.id,
                roleId: event.target.value,
              });
            }}
          >
            {props.rolesInDialog.map((role) => {
              return <option value={role.id} key={role.id}>{role.name}</option>;
            })}
          </select>
        </div>
        <div>
          <label htmlFor={`line-text-${props.line.id}`}>Line Text</label>
          <input
            id={`line-text-${props.line.id}`}
            type={"text"}
            value={text}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setText(event.target.value);
            }}
            onBlur={async () => {
              await updateLine({
                id: props.line.id,
                text
              });
            }}
          />
        </div>
        <div>
          <label htmlFor={`line-number-${props.line.id}`}>Line Number</label>
          <input
            id={`line-number-${props.line.id}`}
            type={"number"}
            step={1}
            min={1}
            value={number}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (!(event.target.value === "")) {
                setNumber(event.target.value);
              }
            }}
            onBlur={async () => {
              await updateLine({
                id: props.line.id,
                number: parseInt(number)
              });
            }}
          />
        </div>
        <button
          type={"button"}
          onClick={async () => {
            await deleteLine();
          }}
        >
          Delete Line
        </button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </li>
  );
};
