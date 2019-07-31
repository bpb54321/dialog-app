import React from "react";
import Role from "../types/Role";

export interface GlobalState {
  apiEndpoint: string;
  chosenRole: Role;
  speechRecognition: any;
  token: string | null;
}

export interface GlobalDispatch {
  (globalState: GlobalState): void;
}

export const GlobalStateContext = React.createContext<GlobalState | undefined>(undefined);
export const GlobalDispatchContext = React.createContext<GlobalDispatch | undefined>(undefined);



interface Props {
  speechRecognition: any;
}

export const GlobalProvider: React.FunctionComponent<Props> = (props) => {

  // API Endpoint
  let apiEndpoint: string;
  if (process.env.NODE_ENV === "development") {
    apiEndpoint = (process.env.REACT_APP_LOCAL_API_ENDPOINT as string);
  } else { // production
    apiEndpoint = (process.env.REACT_APP_PRODUCTION_API_ENDPOINT as string);
  }

  // Speech Recognition - configure settings
  const speechRecognition = props.speechRecognition;

  speechRecognition.interimResults = true;
  speechRecognition.maxAlternatives = 1;
  speechRecognition.continuous = true;

  const [globalState, setGlobalState] = React.useState({
    apiEndpoint: apiEndpoint,
    chosenRole: {
      id: "",
      name: "",
    },
    speechRecognition: speechRecognition,
    token: window.sessionStorage.getItem("token"),
  });

  return (
    <GlobalStateContext.Provider value={globalState}>
      <GlobalDispatchContext.Provider value={setGlobalState}>
        {props.children}
      </GlobalDispatchContext.Provider>
    </GlobalStateContext.Provider>
  );
};

export const GlobalConsumer = GlobalStateContext.Consumer;
