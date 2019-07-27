import React, {ChangeEvent, SyntheticEvent, useContext, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";
import {ShallowDialog} from "../types/Dialog";
import {Link} from "react-router-dom";

interface Props {
  dialog: ShallowDialog;
  deleteDialogInDialogList: (dialogId: string) => void;
  match: any;
}

//region updateLineQuery
const updateDialogQuery =
  `
    mutation UpdateDialog($id: String!, $name: String) {
      updateDialog(id: $id, name: $name) {
        id
        name
      }
    }
  `;
//endregion

//region deleteDialogQuery
const deleteDialogQuery =
  `
    mutation DeleteDialog($id: String!) {
      deleteDialog(id: $id)
    }
  `;
//endregion

// TODO: Finish updating DialogWithUpdateAndDelete

export const DialogWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [name, setName] = useState(props.dialog.name);
  const [errorMessage, setErrorMessage] = useState("");

  const updateDialog = async (queryVariables: {
      id: string;
      name: string;
    }): Promise<void> => {

    try {
      await fetchData(updateDialogQuery, queryVariables, "updateDialog", context);
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  const deleteDialogAndRemoveFromList = async (): Promise<void> =>  {

    const queryVariables = {
      id: props.dialog.id,
    };

    try {
      const deletionWasSuccessful: boolean = await fetchData(
        deleteDialogQuery, queryVariables, "deleteLine", context
      );

      if(deletionWasSuccessful) {
        props.deleteDialogInDialogList(props.dialog.id);
      } else {
        setErrorMessage(`There was a problem when attempting to delete the Dialog with id ${props.dialog.id}` +
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
        <div>
          <label htmlFor={`dialog-name-${props.dialog.id}`}>Dialog Name</label>
          <input
            id={`dialog-name-${props.dialog.id}`}
            type={"text"}
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
            onBlur={async () => {
              await updateDialog({
                id: props.dialog.id,
                name
              });
            }}
          />
        </div>
        <button
          type={"submit"}
          onClick={async () => {
            await deleteDialogAndRemoveFromList();
          }}
        >
          Delete Dialog
        </button>
      </form>
      <div>
        <Link to={`${props.match.url}/${props.dialog.id}/choose-role`}>Practice</Link>&nbsp;|&nbsp;
        <Link to={`${props.match.url}/${props.dialog.id}/edit`}>Edit</Link>
      </div>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </li>
  );
};
