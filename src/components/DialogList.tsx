import {ShallowDialog} from "../types/Dialog";
import {DialogWithUpdateAndDelete} from "./DialogWithUpdateAndDelete";
import React from "react";

export interface DialogListProps {
  match: any;
  removeDialogFromList: (dialogId: string) => void;
  dialogs: ShallowDialog[];
}

export const DialogList: React.FunctionComponent<DialogListProps> = (props) => {
  
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








