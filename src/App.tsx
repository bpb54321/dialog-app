/* global SpeechRecognition */
import React from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';
import './App.css';

import Dialog from "./types/Dialog";
import LineData from "./types/LineData";

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

  addGuessToCurrentLineAndIncrementLineNumber = (lineGuess: string) => {
    this.setState((previousState: AppState) => {
      let currentUserRoleLineNumber: number;
      let currentUserRoleLine: LineData;
      let nextUserRoleLineIndex: number;
      let nextMode: InteractionMode;
      let nextDialog: Dialog;

      currentUserRoleLineNumber = previousState.userRoleLineNumbers[previousState.userRoleLineIndex];
      currentUserRoleLine = previousState.currentDialog.lines[currentUserRoleLineNumber];

      nextDialog = {
        ...previousState.currentDialog
      };

      nextDialog.lines[currentUserRoleLineNumber] = {
        id: currentUserRoleLine.id,
        text: currentUserRoleLine.text,
        guess: lineGuess,
        role: currentUserRoleLine.role,
        number: currentUserRoleLine.number,
      };

      nextUserRoleLineIndex = previousState.userRoleLineIndex + 1;

      if (nextUserRoleLineIndex < previousState.userRoleLineNumbers.length) {

        nextMode = InteractionMode.PracticingLines;

        return ({
          currentDialog: nextDialog,
          userRoleLineIndex: nextUserRoleLineIndex,
          mode: nextMode,
        });

      } else {

        nextMode = InteractionMode.DialogComplete;

        return ({
          currentDialog: nextDialog,
          userRoleLineIndex: previousState.userRoleLineNumbers.length - 1,
          mode: nextMode,
        });

      }
    });
  };

  render() {
    return (
      <GlobalProvider>
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
                          return (<PracticePage {...routeProps} context={context} />);
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

    // switch (this.state.mode) {
    //
    //   case InteractionMode.ChoosingRole:
    //     return (
    //       <RolePicker
    //         roles={this.state.currentDialog.roles}
    //         setChosenRole={this.setChosenRole}
    //       />
    //     );
    //   case InteractionMode.PracticingLines:
    //     return (
    //       <>
    //         <ListOfLines
    //           dialog={this.state.currentDialog}
    //           lastLineToDisplay={currentUserRoleLineNumber - 1}
    //         />
    //         <LineGuess
    //           userRole={this.state.userRole}
    //           addLineGuessToLastLine={this.addGuessToCurrentLineAndIncrementLineNumber}
    //           speechRecognition={this.props.speechRecognition}
    //         />
    //       </>
    //     );
    //   case InteractionMode.DialogComplete:
    //     return (
    //       <ListOfLines
    //         dialog={this.state.currentDialog}
    //         lastLineToDisplay={this.state.numberOfLinesInDialog - 1}
    //       />
    //     );
    // }
  }
}
