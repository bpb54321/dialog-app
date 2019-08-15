import React, {ChangeEvent, SyntheticEvent, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {useGlobalState} from "../contexts/GlobalStateContext";
import LineData from "../types/LineData";
import Role from "../types/Role";

interface Props {
  line: LineData;
  rolesInDialog: Role[];
  deleteLineInDialog: (line: LineData) => void;
  updateLine: (line: LineData) => void;
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

export const LineWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const globalState = useGlobalState();

  const [text, setText] = useState(props.line.text);
  const [roleId, setRoleId] = useState(props.line.role.id);
  const [errorMessage, setErrorMessage] = useState("");



  return (
    <li>
      <form
        data-testid={"line-with-update-and-delete"}
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
            value={props.line.number}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              if (!(event.target.value === "")) {
                props.updateLine({
                  ...props.line,
                  number: parseInt(event.target.value)
                });
              }
            }}
          />
        </div>
        <button
          type={"button"}
          onClick={async () => {
            await props.deleteLineInDialog(props.line);
          }}
        >
          Delete Line
        </button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </li>
  );
};
