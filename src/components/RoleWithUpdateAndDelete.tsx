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

const deleteRoleQuery =
  `
    mutation DeleteRole($id: String!) {
      deleteRole(id: $id)
    }
  `;

export const RoleWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [name, setName] = useState(props.role.name);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDeleted, setIsDeleted] = useState(false);

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

  const deleteRole = async (): Promise<void> =>  {

    const queryVariables = {
      id: props.role.id,
    };

    try {
      const deletionWasSuccessful: boolean = await fetchData(
        deleteRoleQuery, queryVariables, "deleteRole", context
      );

      if(deletionWasSuccessful) {
        setIsDeleted(true);
      } else {
        setErrorMessage(`There was a problem when attempting to delete the Role with id ${props.role.id}` +
          `and name ${name}`);
      }
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  if (isDeleted) {
    return null;
  } else {
    return (
      <li>
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
      </li>
    );
  }
};
