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
import SignupPage from "./pages/SignupPage";

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

  render() {
    return (
      <GlobalProvider speechRecognition={this.props.speechRecognition}>
        <BrowserRouter>
            <GlobalConsumer>
              {(context: GlobalContextObject) => {
                if (!context.data.token) {
                  return (
                    <Switch>
                      <Route path={"/auth"} component={AuthPage}/>
                      <Route path={"/sign-up"} component={SignupPage}/>
                      <Redirect from={"/"} to={"/auth"} />
                    </Switch>
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
