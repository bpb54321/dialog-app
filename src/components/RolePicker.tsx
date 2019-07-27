import React, {ChangeEvent, FormEvent, useContext, useEffect, useState} from 'react';
import Role from "../types/Role";
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";

interface Props {
  history: any;
  match: any;
}

const dialogQuery = `
  query DialogQuery($id: String!) {
    dialog(id: $id) {
      name
      roles {
        id
        name
      }
    }
  }
`;

export const RolePicker: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [possibleRoles, setPossibleRoles] = useState<Role[]>([]);
  const [chosenRole, setChosenRole] = useState<Role>({
    id: "",
    name: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {

    // Only fetch data if we don't yet know our possible roles
    if (possibleRoles.length === 0) {

      const {
        params: {
          dialogId
        }
      } = props.match;

      const queryVariables = {
        id: dialogId,
      };

      fetchData(dialogQuery, queryVariables, "dialog", context).then((dialog: {
        name: string;
        roles: Role[];
      }) => {
        setPossibleRoles(dialog.roles);

        if (dialog.roles.length > 0) {
          setChosenRole(dialog.roles[0]);
        }
      }).catch((error: Error) => {
        setErrorMessage(error.message);
      });

    }
  });

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.selectedOptions[0];
    setChosenRole({
      id: selectedOption.value,
      name: selectedOption.text,
    });
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    context.actions.setGlobalState({
      chosenRole: chosenRole
    });

    // Navigate to practice page for this dialog
    const currentUrl = props.match.url;
    const newUrl = currentUrl.replace("choose-role", "practice");
    props.history.push(newUrl);
  };

  if (possibleRoles.length <= 0) {
    return <p>You must add roles to the dialog before you can choose a role.</p>;
  } else {
    return (
      <>
        <form data-testid={"role-picker"}
              onSubmit={handleSubmit}>
          <h2>Role Picker</h2>
          <label htmlFor="role-picker__select">Available Roles</label>
          <select
            name="role"
            id="role-picker__select"
            data-testid={"role-picker__select"}
            value={chosenRole.id}
            onChange={handleChange}
          >
            {possibleRoles.map((role: Role, index: number) => {
              return <option key={index} value={role.id}>{role.name}</option>
            })}
          </select>
          <input type={"submit"} data-testid={"role-picker__submit"} value={"Confirm Role Selection"}/>
        </form>
        {errorMessage ? <p>{errorMessage}</p> : null}
      </>
    );
  }
};
