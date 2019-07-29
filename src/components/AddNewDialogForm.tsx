import React, {ChangeEvent, SyntheticEvent, useContext, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";
import {ShallowDialog} from "../types/Dialog";
import {LANGUAGE_CODES} from "../utils/constants";


interface Props {
  addDialogToDialogList: (shallowDialog: ShallowDialog) => void;
}

//region createDialogQuery
const createDialogQuery =
  `
    mutation CreateDialog($name: String!, $languageCode: String!) {
      createDialog(name: $name, languageCode: $languageCode) {
        id
        name
        languageCode
      }
    }
  `;
//endregion

export const AddNewDialogForm: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [name, setName] = useState("");
  const [languageCode, setLanguageCode] = useState("en-US");
  const [errorMessage, setErrorMessage] = useState("");

  const createDialog = async (queryVariables: {
    name: string;
    languageCode: string;
  }): Promise<undefined|ShallowDialog> => {

    try {
      const createdDialog: ShallowDialog = await fetchData(
        createDialogQuery,
        queryVariables,
        "createDialog",
        context
      );
      return createdDialog;
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  return (
    <>
      <h3>Add A New Dialog</h3>
      <form
        onSubmit={async (event: SyntheticEvent) => {
          event.preventDefault();
          const returnedDialog = await createDialog({
            name,
            languageCode,
          });
          if (returnedDialog) {
            props.addDialogToDialogList(returnedDialog);
          }
          setName("");
        }}
      >
        <div>
          <label htmlFor={`new-dialog-name`}>Dialog Name</label>
          <input
            id={`new-dialog-name`}
            type={"text"}
            value={name}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              setName(event.target.value);
            }}
          />
        </div>
        <div>
          <label htmlFor={`new-dialog-lang`}>Dialog Language</label>
          <select
            name="languageCode"
            id={`new-dialog-lang`}
            value={languageCode}
            onChange={async (event: ChangeEvent<HTMLSelectElement>) => {
              setLanguageCode(event.target.value);
            }}
          >
            {LANGUAGE_CODES.map((language) => {
              return <option value={language.code} key={language.code}>{language.description}</option>;
            })}
          </select>
        </div>
        <button
          type={"submit"}
        >
          Add Dialog
        </button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </>
  );
};
