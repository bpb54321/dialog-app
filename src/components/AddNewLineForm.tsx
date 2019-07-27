import React, {ChangeEvent, SyntheticEvent, useContext, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";
import LineData from "../types/LineData";
import Role from "../types/Role";

interface Props {
  dialogId: string;
  rolesInDialog: Role[];
  addLineToDialog: (line: LineData) => void;
}

//region createLineQuery
const createLineQuery =
  `
    mutation CreateLine($text: String!, $roleId: String!, $dialogId: String!, $number: Int!) {
      createLine(text: $text, roleId: $roleId, dialogId: $dialogId, number: $number) {
        id
        text
        number
        role {
          id
          name
        }
      }
    }
  `;
//endregion

export const AddNewLineForm: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [text, setText] = useState("");

  let defaultRoleId = "";
  if (props.rolesInDialog.length > 0) {
    defaultRoleId = props.rolesInDialog[0].id;
  }

  const [roleId, setRoleId] = useState(defaultRoleId);
  const [errorMessage, setErrorMessage] = useState("");

  const createLine = async (queryVariables: {
    text: string;
    roleId: string;
    dialogId: string;
    number: number;
  }): Promise<void> => {

    try {
      const createdLine: LineData = await fetchData(createLineQuery, queryVariables, "createLine", context);
      props.addLineToDialog(createdLine);
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  if (props.rolesInDialog.length <= 0) {
    return <p>You must add at least one role to the dialog in order to add a line to the dialog.</p>
  } else {
    return (
      <>
        <h3>Add A New Line</h3>
        <form
          onSubmit={async (event: SyntheticEvent) => {
            event.preventDefault();
            await createLine({
              roleId,
              dialogId: props.dialogId,
              text,
              number: 1,
            });
            setText("");
          }}
        >
          <div>
            <label htmlFor={`new-line-role`}>Role</label>
            <select
              name="role"
              id={`new-line-role`}
              value={roleId}
              onChange={async (event: ChangeEvent<HTMLSelectElement>) => {
                setRoleId(event.target.value);
              }}
            >
              {props.rolesInDialog.map((role) => {
                return <option value={role.id} key={role.id}>{role.name}</option>;
              })}
            </select>
          </div>
          <div>
            <label htmlFor={`new-line-text`}>Line Text</label>
            <input
              id={`new-line-text`}
              type={"text"}
              value={text}
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                setText(event.target.value);
              }}
            />
          </div>
          <button
            type={"submit"}
          >
            Add Line
          </button>
        </form>
        {errorMessage ? <p>{errorMessage}</p> : null}
      </>
    );
  }
};
