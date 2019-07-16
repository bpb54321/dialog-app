import React from "react";
import {UserContextObject} from "../types/UserContextObject";

const UserContext = React.createContext<UserContextObject>({
  userData: {
    token: "",
  },
  setUserData: (token: string) => {},
});

export const UserProvider = UserContext.Provider;
export const UserConsumer = UserContext.Consumer;
