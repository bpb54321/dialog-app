import React from "react";
import Role from "../types/Role";

export const GlobalStateContext = React.createContext<GlobalState | undefined>(undefined);

export const GlobalConsumer = GlobalStateContext.Consumer;

interface Props {
  speechRecognition: any;
}

interface GlobalState {
  apiEndpoint: string;
  chosenRole: Role;
  speechRecognition: any;
  token: string | null;
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
      {props.children}
    </GlobalStateContext.Provider>
  );
};
