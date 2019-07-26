import React, {ChangeEvent, useContext, useState, FocusEvent, SyntheticEvent} from 'react';
import Role from "../types/Role";
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";

interface Props {
  role: Role;
}

const updateRoleQuery =
  `
    mutation UpdateRole($id: String!, $name: String) {
      updateRole(id: $id, name: $name) {
        id
        name
      }
    }
  `;

export const RoleWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [name, setName] = useState(props.role.name);
  const [errorMessage, setErrorMessage] = useState("");

  const updateRole = async (updatedName: string): Promise<void> => {

    const queryVariables = {
      id: props.role.id,
      name: updatedName,
    };

    try {
      const updatedRole: {id: string; name: string;} = await fetchData(updateRoleQuery, queryVariables, "updateRole", context);
      setName(updatedRole.name);
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  const deleteRole = () => {
    console.log("You attempted to delete a Role!");
  };

  return (
    <>
      <form>
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
          onClick={(event: SyntheticEvent) => {
            deleteRole();
          }}
        >
          Delete Role
        </button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </>
  );

};
