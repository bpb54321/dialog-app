/* global SpeechRecognition */
import React from 'react';
import {BrowserRouter, Route, Redirect, Switch, Link} from 'react-router-dom';
import './App.css';

import {Dialog} from "./types/Dialog";

import {InteractionMode} from "./types/InteractionMode";
import DialogListPage from "./pages/DialogListPage";
import {AuthPage} from "./pages/AuthPage";
import {ChooseRolePage} from "./pages/ChooseRolePage";
import PracticePage from "./pages/PracticePage";

import {GlobalConsumer, GlobalProvider} from "./contexts/GlobalContext";
import {GlobalContextObject} from "./contexts/GlobalContext";
import SignupPage from "./pages/SignupPage";
import DialogEditPage from "./pages/DialogEditPage";

interface AppProps {
  speechRecognition: SpeechRecognition;
}

interface AppState {
  dialogs: Dialog[];
  numberOfLinesInDialog: number;
  userRoleLineIndex: number;
  userRole: string;
  userRoleLineNumbers: number[];
  mode: InteractionMode;
}

export class App extends React.Component<AppProps, AppState> {

  state: AppState = {
    dialogs: [],
    numberOfLinesInDialog: 0,
    userRoleLineIndex: 0,
    userRole: "",
    userRoleLineNumbers: [],
    mode: InteractionMode.LoadingData,
  };

  render() {
    return (
      <body className={"app"}>
        <GlobalProvider speechRecognition={this.props.speechRecognition}>
          <BrowserRouter>
              <GlobalConsumer>
                {(context: GlobalContextObject) => {
                  return (
                    <>
                      <header>
                        <nav className="navbar navbar-light bg-light">
                          <Link className="navbar-brand app__home-link" to={"/"}>Dialog Practice</Link>
                        </nav>
                      </header>
                      <main className={"app__main"}>
                        {
                          (!context.data.token) ?
                            <Switch>
                              <Route path={"/auth"} component={AuthPage}/>
                              <Route path={"/sign-up"} component={SignupPage}/>
                              <Redirect from={"/"} to={"/auth"} />
                            </Switch>
                          :
                            <Switch>
                              <Redirect exact from={"/"} to={"/dialogs"}/>
                              <Redirect from={"/auth"} to={"/dialogs"}/>
                              {/* Sign-up page after account creation, gives user feedback that account was created */}
                              <Route path={"/sign-up"} component={SignupPage}/>
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
                              <Route
                                path={"/dialogs/:dialogId/edit"}
                                render={(routeProps) => {
                                  return (
                                    <DialogEditPage
                                      {...routeProps}
                                      context={context}
                                    />
                                  );
                                }}
                              />
                            </Switch>
                        }
                      </main>
                    </>
                  );
                }}
              </GlobalConsumer>

          </BrowserRouter>
        </GlobalProvider>
      </body>
    );
  }
}
