import React, {ChangeEvent, FormEvent, useContext, useState, FocusEvent} from 'react';
import Role from "../types/Role";
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";

interface Props {
  role: Role;
}

const updateRoleQuery =
  `
    mutation UpdateRole($id: String!, $updatedRole: RoleInput!) {
      updateRole(id: $id, updatedRole: $updatedRole) {
        id
        name
      }
    }
  `;

export const RoleWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [name, setName] = useState(props.role.name);

  const updateRole = async (updatedName: string): Promise<void> => {

    const queryVariables = {
      id: props.role.id,
      updatedRole: {
        name: updatedName,
      },
    };

    await fetchData(updateRoleQuery, queryVariables, "updateRole", context);
  };

  return (
    <>
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
    </>
  );

};
