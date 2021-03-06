import React from 'react';
import {BrowserRouter, Route, Redirect, Switch, Link} from 'react-router-dom';
import styles from './css/App.module.css';
import DialogListPage from "./pages/DialogListPage";
import {LoginPage} from "./pages/LoginPage";
import {ChooseRolePage} from "./pages/ChooseRolePage";
import {PracticePage} from "./pages/PracticePage";
import {useGlobalState} from "./contexts/GlobalStateContext";
import {SignupPage} from "./pages/SignupPage";
import {DialogEditPage} from "./pages/DialogEditPage";
import {LogoutButton} from "./components/LogoutButton";

interface Props {
}


export const App: React.FunctionComponent<Props> = (props) => {

  const globalState = useGlobalState();

  return (
    <BrowserRouter>
      <>
        <header>
          <nav className="navbar navbar-light bg-light justify-content-between">
            <Link className={`navbar-brand ${styles.homeLink}`} to={"/"}>Dialog Practice</Link>
            <LogoutButton/>
          </nav>
        </header>
        <main className={styles.main}>
          {
            (!globalState.token) ?
              <Switch>
                <Route path={"/auth"} component={LoginPage}/>
                <Route path={"/sign-up"} component={SignupPage}/>
                <Redirect from={"/"} to={"/auth"}/>
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
                    return (
                      <DialogListPage context={globalState} {...routeProps}/>
                    );
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
                    if (globalState.chosenRole.id) {
                      return (
                        <PracticePage
                          {...routeProps}
                          chosenRole={globalState.chosenRole}
                        />);
                    } else {
                      return (
                        <Redirect to={`/dialogs/${routeProps.match.params.dialogId}/choose-role`}/>
                      );
                    }
                  }}
                />
                <Route
                  path={"/dialogs/:dialogId/edit"}
                  render={(routeProps) => {
                    return (
                      <DialogEditPage
                        {...routeProps}
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
