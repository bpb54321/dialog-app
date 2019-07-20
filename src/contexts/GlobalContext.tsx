import React from "react";
import {GlobalContextObject} from "../types/GlobalContextObject";

const defaultContext: GlobalContextObject = {
  data: {
    token: "",
    apiEndpoint: "",
  },
  actions: {
    setUserData: (token: string) => {
      return
    },
  },
};
const GlobalContext = React.createContext<GlobalContextObject>(defaultContext);

export const GlobalConsumer = GlobalContext.Consumer;

interface Props {

}

interface State {
  token: string;
  apiEndpoint: string;
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

    this.state = initialState;
  }

  setUserData = (token: string) => {
    this.setState({
      token
    });
  };

  render() {
    return (
      <GlobalContext.Provider value={{
        data: this.state,
        actions: {
          setUserData: this.setUserData,
        },
      }}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}
