import {ShallowDialog} from "../types/Dialog";
import {DialogWithUpdateAndDelete} from "./DialogWithUpdateAndDelete";
import React from "react";

interface Props {
  dialogs: ShallowDialog[];
  match: any;
  removeDialogFromList: (dialogId: string) => void;
}

export const DialogList: React.FunctionComponent<Props> = (props) => {
  return (
    <>
      <ul>
        {
          props.dialogs.map((dialog: ShallowDialog) => {
            return (
              <DialogWithUpdateAndDelete
                key={dialog.id}
                dialog={dialog}
                deleteDialogInDialogList={props.removeDialogFromList}
                match={props.match}
              />
            );
          })
        }
      </ul>
    </>
  );
};








