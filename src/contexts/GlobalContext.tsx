import React from "react";
import Role from "../types/Role";

export const GlobalContext = React.createContext<GlobalContextObject>(({} as GlobalContextObject));

export const GlobalConsumer = GlobalContext.Consumer;

interface Props {
  speechRecognition: any;
}

interface GlobalState {
  apiEndpoint: string;
  chosenRole: Role;
  speechRecognition: any;
  token: any;
}

export interface GlobalContextObject {
  data: GlobalState;
  actions: {
    setGlobalState: (newStateObject: Partial<GlobalState>) => void;
  };
}

export class GlobalProvider extends React.Component<Props, GlobalState> {

  state = {
    apiEndpoint: "",
    chosenRole: {
      id: "",
      name: "",
    },
    speechRecognition: null,
    token: "",
  };

  constructor(props: Props) {
    super(props);

    if (process.env.NODE_ENV === "development") {
      this.state.apiEndpoint = (process.env.REACT_APP_LOCAL_API_ENDPOINT as string);
    } else { // production
      this.state.apiEndpoint = (process.env.REACT_APP_PRODUCTION_API_ENDPOINT as string);
    }

    this.state.speechRecognition = props.speechRecognition;

    this.state.token =  (window.sessionStorage.getItem("token") as any);
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
