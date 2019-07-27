import React, {FunctionComponent} from 'react';
import {RolePicker} from "../components/RolePicker";

interface Props {
  match: any;
  location: any;
  history: any;
}

export const ChooseRolePage: FunctionComponent<Props> = (props) => {

  return(
    <>
      <h1>The Choose Role Page</h1>
      <RolePicker
        history={props.history}
        match={props.match}
      />
    </>
  );

};
