import React from "react";
import Role from "../types/Role";

export const GlobalContext = React.createContext<GlobalContextObject>(({} as GlobalContextObject));

export const GlobalConsumer = GlobalContext.Consumer;

interface Props {
  speechRecognition: any;
}

interface GlobalState {
  token: string;
  loggedIn: boolean;
  apiEndpoint: string;
  chosenRole: Role;
  speechRecognition: any;
}

export interface GlobalContextObject {
  data: GlobalState;
  actions: {
    setGlobalState: (newStateObject: Partial<GlobalState>) => void;
  };
}

export class GlobalProvider extends React.Component<Props, GlobalState> {

  state = {
    token: "",
    loggedIn: false,
    apiEndpoint: "",
    chosenRole: {
      id: "",
      name: "",
    },
    speechRecognition: null,
  };

  constructor(props: Props) {
    super(props);

    if (process.env.NODE_ENV === "development") {
      this.state.apiEndpoint = (process.env.REACT_APP_LOCAL_API_ENDPOINT as string);
    } else { // production
      this.state.apiEndpoint = (process.env.REACT_APP_PRODUCTION_API_ENDPOINT as string);
    }

    this.state.speechRecognition = props.speechRecognition;
  }

  setGlobalState = (newStateObject: Partial<GlobalState>) => {
    this.setState((previousState) => {
      return {
        ...previousState,
        ...newStateObject,
      };
    });
  };

  render() {
    return (
      <GlobalContext.Provider value={{
        data: this.state,
        actions: {
          setGlobalState: this.setGlobalState,
        },
      }}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}
