/* global SpeechRecognition */
import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';

import Dialog from "./types/Dialog";

import {InteractionMode} from "./types/InteractionMode";
import DialogListPage from "./pages/DialogListPage";
import AuthPage from "./pages/AuthPage";
import ChooseRolePage from "./pages/ChooseRolePage";
import PracticePage from "./pages/PracticePage";
import {GlobalConsumer, GlobalProvider} from "./contexts/GlobalContext";
import {GlobalContextObject} from "./types/GlobalContextObject";

interface AppProps {
  speechRecognition: SpeechRecognition;
}

interface AppState {
  dialogs: Dialog[];
  currentDialog: Dialog;
  numberOfLinesInDialog: number;
  userRoleLineIndex: number;
  userRole: string;
  userRoleLineNumbers: number[];
  mode: InteractionMode;
}

export class App extends React.Component<AppProps, AppState> {

  state: AppState = {
    dialogs: [],
    currentDialog: {
      id: "random",
      name: "",
      lines: [],
    },
    numberOfLinesInDialog: 0,
    userRoleLineIndex: 0,
    userRole: "",
    userRoleLineNumbers: [],
    mode: InteractionMode.LoadingData,
  };

  // async componentDidMount() {
  //   // Get list of dialogs
  //   let responseBody = await fetch("http://localhost/dialogs/");
  //   let responseJson: any = await responseBody.json();
  //
  //   let dialogs = responseJson._embedded.dialogs;
  //
  //   // Set SpeechRecognition object's settings
  //   this.props.speechRecognition.lang = "fr-FR";
  //   this.props.speechRecognition.continuous = true;
  //   this.props.speechRecognition.interimResults = true;
  //
  //   this.setState((previousState: AppState) : object => {
  //     return {
  //       dialogs: dialogs,
  //       mode: InteractionMode.ChoosingDialog,
  //     };
  //   });
  // }

  setUserRoleAndChangeMode = async (role: string) => {
    // const userRoleLineNumbers = await this.calculateUserLineNumbers(
    //   "dummy string", role
    // );
    //
    // this.setState({
    //   // userRole: role,
    //   userRoleLineNumbers: userRoleLineNumbers,
    //   mode: InteractionMode.PracticingLines,
    // });
  };

  render() {
    return (
      <GlobalProvider speechRecognition={this.props.speechRecognition}>
        <BrowserRouter>
            <GlobalConsumer>
              {(context: GlobalContextObject) => {
                if (!context.data.token) {
                  return (
                    <>
                      <Redirect from={"/"} to={"/auth"} />
                      <Route path={"/auth"} component={AuthPage}/>
                    </>
                  );
                } else {
                  return (
                    <Switch>
                      <Redirect exact from={"/"} to={"/dialogs"}/>
                      <Redirect from={"/auth"} to={"/dialogs"}/>
                      <Route
                        exact
                        path={"/dialogs"}
                        render={(routeProps) => {
                          return (<DialogListPage {...routeProps} context={context}/>);
                        }}
                      />
                      <Route
                        path={"/dialogs/:dialogId/choose-role"}
                        render={(routeProps) => {
                          return (<ChooseRolePage {...routeProps}/>);
                        }}
                      />
                      <Route
                        path={"/dialogs/:dialogId/practice"}
                        render={(routeProps) => {
                          return (<PracticePage
                            {...routeProps}
                            context={context}
                          />);
                        }}
                      />
                    </Switch>
                  );
                }
              }}
            </GlobalConsumer>

        </BrowserRouter>
      </GlobalProvider>
    );
  }
}
