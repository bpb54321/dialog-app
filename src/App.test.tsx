import React from 'react';
import { shallow } from 'enzyme';
import App from './App';
import Line from "./Line";

// Sample dialog data
import { testDialog } from "./data/test-dialog";

describe('App', () => {

  const app = shallow<App>(<App />);
  app.instance().setState({
    currentDialog: testDialog,
  });

  it("has a default current line number of 0", () => {
    expect(app.instance().state.currentUserLineNumber).toEqual(0);
  });

  // it("prints all the lines up to the current line", () => {
  //   expect(app.find(Line)).toHaveLength(1);
  //
  //   app.instance().setState({
  //     currentUserLineNumber: 1,
  //   });
  //   expect(app.find(Line)).toHaveLength(2);
  //
  //   app.instance().setState({
  //     currentUserLineNumber: 2,
  //   });
  //   expect(app.find(Line)).toHaveLength(3);
  //
  // });

  it("should print, on initialization, all the lines up to the first line of the user's role", function () {
    // Given that the user role is User1
    // And that User1 has the first line in the dialogue
    app.instance().setState({
      userRole: "User1",
    });

    // let foundLines = app.find(Line);

    // let foundHtml = app.find(<p>Text for line 0.</p>);


    // app.children();

    // Then I expect that the first line in the dialogue will be displayed
    expect(app.contains(<Line text={"Text for line 0."} key={0} />)).toBe(true);
  });


});

