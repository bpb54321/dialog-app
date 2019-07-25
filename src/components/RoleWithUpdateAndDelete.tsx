import React from 'react';
import Role from "../types/Role";

interface Props {
  role: Role;
}

export const RoleWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  return (
    <>{props.role.name}</>
  );

};
