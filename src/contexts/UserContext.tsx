import React from "react";
import {UserContextObject} from "../types/UserContextObject";

const UserContext = React.createContext<UserContextObject>({
  token: "",
  actions: {
    setUserData: (token: string) => {},
  },
});

export const UserConsumer = UserContext.Consumer;

interface State {
  token: string;
}

export class UserProvider extends React.Component {
  state: State = {
    token: "",
  };

  setUserData = (token: string) => {
    this.setState({
      token
    });
  }

  render() {
    return (
      <UserContext.Provider value={{
        token: this.state.token,
        actions: {
          setUserData: this.setUserData,
        },
      }}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}
