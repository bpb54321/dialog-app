import React from 'react';
import {GlobalContextObject} from "../types/GlobalContextObject";
import RolePicker from "../RolePicker";
import {GlobalConsumer} from "../contexts/GlobalContext";

interface Props {
  match: any;
  location: any;
  history: any;
}

interface State {
}

export default class ChooseRolePage extends React.Component<Props, State> {

  render() {
    return (
      <GlobalConsumer>
        {(context: GlobalContextObject) => {
          return(
            <>
              <h1>The Choose Role Page</h1>
              <RolePicker
                history={this.props.history}
                match={this.props.match}
                context={context}
              />
            </>
          );

        }}
      </GlobalConsumer>
    );
  }
}
