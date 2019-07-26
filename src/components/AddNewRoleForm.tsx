import React, {ChangeEvent, SyntheticEvent, useContext, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";
import Role from "../types/Role";

interface Props {
  dialogId: string;
  addRoleToDialog: (role: Role) => void;
}

//region createRoleQuery
const createRoleQuery =
  `
    mutation CreateRole($name: String!, $dialogId: String!) {
      createRole(name: $name, dialogId: $dialogId) {
        id
        name
        dialog {
          id
        }
      }
    }
  `;
//endregion

export const AddNewRoleForm: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createRoleAndAddToDialog = async (queryVariables: {
    name: string;
    dialogId: string;
  }): Promise<void> => {

    try {
      const createdRole: Role = await fetchData(createRoleQuery, queryVariables, "createRole", context);
      props.addRoleToDialog(createdRole);
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  return (
    <>
      <h3>Add A New Role</h3>
      <form
        onSubmit={async (event: SyntheticEvent) => {
          event.preventDefault();
          await createRoleAndAddToDialog({
            name,
            dialogId: props.dialogId,
          });
          setName("");
        }}
      >
        <div>
          <label htmlFor={"role-name"}>Role Name</label>
          <input
            id={"role-name"}
            type={"text"}
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
          />
        </div>
        <button type={"submit"}>
          Add Line
        </button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </>
  );
};
