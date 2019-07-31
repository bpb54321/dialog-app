import React, {ChangeEvent, useContext, useState, FocusEvent, SyntheticEvent} from 'react';
import Role from "../types/Role";
import fetchData from "../utils/fetch-data";
import {GlobalStateContext, useGlobalDispatch, useGlobalState} from "../contexts/GlobalStateContext";

interface Props {
  role: Role;
  deleteRoleInDialog: (roleId: string) => void;
}

//region updateRoleQuery
const updateRoleQuery =
  `
    mutation UpdateRole($id: String!, $name: String) {
      updateRole(id: $id, name: $name) {
        id
        name
      }
    }
  `;
//endregion

//region deleteRoleQuery
const deleteRoleQuery =
  `
    mutation DeleteRole($id: String!) {
      deleteRole(id: $id)
    }
  `;
//endregion

export const RoleWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const globalState = useGlobalState();
  const globalDispatch = useGlobalDispatch();

  const [name, setName] = useState(props.role.name);
  const [errorMessage, setErrorMessage] = useState("");

  const updateRole = async (updatedName: string): Promise<void> => {

    const queryVariables = {
      id: props.role.id,
      name: updatedName,
    };

    try {
      const updatedRole: {id: string; name: string;} = await fetchData(
        updateRoleQuery,
        queryVariables,
        "updateRole",
        globalState
      );
      setName(updatedRole.name);
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  const deleteRole = async (): Promise<void> =>  {

    const queryVariables = {
      id: props.role.id,
    };

    try {
      const deletionWasSuccessful: boolean = await fetchData(
        deleteRoleQuery, queryVariables, "deleteRole", globalState
      );

      if(deletionWasSuccessful) {
        props.deleteRoleInDialog(props.role.id);
      } else {
        setErrorMessage(`There was a problem when attempting to delete the Role with id ${props.role.id}` +
          `and name ${name}`);
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
        <input
          type={"text"}
          value={name}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setName(event.target.value);
          }}
          onBlur={async (event: FocusEvent<HTMLInputElement>) => {
            await updateRole(name);
          }}
        />
        <button
          type={"button"}
          onClick={async (event: SyntheticEvent) => {

            await deleteRole();
          }}
        >
          Delete Role
        </button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </li>
  );

};
