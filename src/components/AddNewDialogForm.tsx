import React, {ChangeEvent, useContext, useState} from 'react';
import fetchData from "../utils/fetch-data";
import {GlobalContext} from "../contexts/GlobalContext";
import {ShallowDialog} from "../types/Dialog";



interface Props {
  addDialogToDialogList: (shallowDialog: ShallowDialog) => void;
}

//region createDialogQuery
const createDialogQuery =
  `
    mutation CreateDialogQuery($name: String!) {
        createDialog(name: $name) {
          name
          id
        }
    }
  `;
//endregion

export const AddNewDialogForm: React.FunctionComponent<Props> = (props) => {

  const context = useContext(GlobalContext);

  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const createDialog = async (queryVariables: {
    name: string;
  }): Promise<void> => {

    try {
      const createdDialog: ShallowDialog = await fetchData(
        createDialogQuery,
        queryVariables,
        "createDialog",
        context
      );
      props.addDialogToDialogList(createdDialog);
    } catch(error) {
      setErrorMessage(error.message);
    }

  };

  return (
    <>
      <h3>Add A New Dialog</h3>
      <form>
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
        <button
          type={"button"}
          onClick={async () => {
            await createDialog({
              name
            });
            setName("");
          }}
        >
          Add Dialog
        </button>
      </form>
      {errorMessage ? <p>{errorMessage}</p> : null}
    </>
  );
};
