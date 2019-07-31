import React, {ChangeEvent, SyntheticEvent, useContext, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalStateContext, useGlobalState} from "../contexts/GlobalStateContext";
import {ShallowDialog} from "../types/Dialog";
import {Link} from "react-router-dom";
import {LANGUAGE_CODES} from "../utils/constants";

interface Props {
  dialog: ShallowDialog;
  deleteDialogInDialogList: (dialogId: string) => void;
  match: any;
}

//region updateLineQuery
const updateDialogQuery =
  `
    mutation UpdateDialog($id: String!, $name: String, $languageCode: String) {
      updateDialog(id: $id, name: $name, languageCode: $languageCode) {
        id
        name
        languageCode
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

export const DialogWithUpdateAndDelete: React.FunctionComponent<Props> = (props) => {

  const globalState = useGlobalState();

  const [name, setName] = useState(props.dialog.name);
  const [languageCode, setLanguageCode] = useState(props.dialog.languageCode);
  const [errorMessage, setErrorMessage] = useState("");

  const updateDialog = async (queryVariables: {
      id: string;
      name?: string;
      languageCode?: string;
    }): Promise<void> => {

    try {
      await fetchData(updateDialogQuery, queryVariables, "updateDialog", globalState);
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
        deleteDialogQuery, queryVariables, "deleteDialog", globalState
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
        <div>
          <label htmlFor={`dialog-lang-$${props.dialog.id}`}>Dialog Language</label>
          <select
            name="languageCode"
            id={`dialog-lang-$${props.dialog.id}`}
            value={languageCode}
            onChange={async (event: ChangeEvent<HTMLSelectElement>) => {
              setLanguageCode(event.target.value);
              await updateDialog({
                id: props.dialog.id,
                languageCode: event.target.value,
              })
            }}
          >
            {LANGUAGE_CODES.map((language) => {
              return <option value={language.code} key={language.code}>{language.description}</option>;
            })}
          </select>
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
