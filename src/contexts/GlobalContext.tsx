import React from "react";
import {GlobalContextObject} from "../types/GlobalContextObject";
import Role from "../types/Role";

const defaultContext: GlobalContextObject = {
  data: {
    token: "",
    apiEndpoint: "",
    chosenRole: {
      id: "",
      name: "",
    },
    speechRecognition: null,
  },
  actions: {
    setUserData: (token: string) => {
      return;
    },
    setChosenRole: (role: Role) => {
      return;
    },
  },
};
const GlobalContext = React.createContext<GlobalContextObject>(defaultContext);

export const GlobalConsumer = GlobalContext.Consumer;

interface Props {
  speechRecognition: any;
}

interface State {
  token: string;
  apiEndpoint: string;
  chosenRole: Role;
  speechRecognition: any;
}

export class GlobalProvider extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    let {data: initialState} = defaultContext;

    if (process.env.NODE_ENV === "development") {
      initialState.apiEndpoint = (process.env.REACT_APP_LOCAL_API_ENDPOINT as string);
    } else { // production
      initialState.apiEndpoint = (process.env.REACT_APP_PRODUCTION_API_ENDPOINT as string);
    }

    initialState.speechRecognition = props.speechRecognition;

    this.state = initialState;
  }

  setUserData = (token: string) => {
    this.setState({
      token
    });
  };

  setChosenRole = (role: Role) => {
    this.setState({
      chosenRole: role,
    });
  };

  render() {
    return (
      <GlobalContext.Provider value={{
        data: this.state,
        actions: {
          setUserData: this.setUserData,
          setChosenRole: this.setChosenRole,
        },
      }}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}
