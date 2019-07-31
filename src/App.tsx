/* global SpeechRecognition */
import React from 'react';
import {BrowserRouter, Route, Redirect, Switch, Link} from 'react-router-dom';
import './App.css';
import DialogListPage from "./pages/DialogListPage";
import {AuthPage} from "./pages/AuthPage";
import {ChooseRolePage} from "./pages/ChooseRolePage";
import {PracticePage} from "./pages/PracticePage";
import {useGlobalState} from "./contexts/GlobalStateContext";
import {SignupPage} from "./pages/SignupPage";
import DialogEditPage from "./pages/DialogEditPage";
import {LogoutButton} from "./components/LogoutButton";

interface Props {
  speechRecognition: SpeechRecognition;
}


export const App: React.FunctionComponent<Props> = (props) => {

  const globalState = useGlobalState();

  return (
      <BrowserRouter>
        <>
          <header>
            <nav className="navbar navbar-light bg-light justify-content-between">
              <Link className="navbar-brand app__home-link" to={"/"}>Dialog Practice</Link>
              <LogoutButton/>
            </nav>
          </header>
          <main className={"app__main"}>
            {
              (!globalState.token) ?
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
                      return (<DialogListPage {...routeProps} context={globalState}/>);
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
                      />);
                    }}
                  />
                  <Route
                    path={"/dialogs/:dialogId/edit"}
                    render={(routeProps) => {
                      return (
                        <DialogEditPage
                          {...routeProps}
                          context={globalState}
                        />
                      );
                    }}
                  />
                </Switch>
            }
          </main>
        </>
      </BrowserRouter>
  );
}
