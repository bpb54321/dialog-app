import React from 'react';
import {shallow, ShallowWrapper} from 'enzyme';
import {App, AppProps, AppState} from "./App";

import Line from "./Line";

// Sample dialog data
import { testDialog } from "./data/test-dialog";
import Button from "./Button";
import {render, RenderResult} from "@testing-library/react";
import {FetchMock} from "jest-fetch-mock";
const fetchMock = fetch as FetchMock;

// Mock the AJAX response that we get using the axios module
jest.mock("axios");


describe('App', () => {

  let wrapper: RenderResult;
  let appInstance: App;

  beforeEach(async () => {
    fetchMock.resetMocks();
  });

  it("should calculate the line numbers for the user's role", function () {

    appInstance = new App({});

    // Check that the line numbers for Role 0 are correct
    const roleOLineNumbers = appInstance.calculateUserLineNumbers(testDialog, "Role 0");

    expect(roleOLineNumbers).toEqual([0, 2]);

    // Check that the line numbers for Role 1 are correct
    const role1LineNumbers = appInstance.calculateUserLineNumbers(testDialog, "Role 1");

    expect(role1LineNumbers).toEqual([1, 3]);

  });

  // it("displays the lines up to but not including the first line of Role 1", function () {
  //   expect(app.instance().state.currentDialog).toEqual({
  //     name: "testDialog",
  //     roles: ["Role 0", "Role 1"],
  //     lines: [
  //       {
  //         text: "Text for line 0.",
  //         role: "Role 0",
  //         key: 0,
  //       },
  //       {
  //         text: "Text for line 1.",
  //         role: "Role 1",
  //         key: 1,
  //       },
  //       {
  //         text: "Text for line 2.",
  //         role: "Role 0",
  //         key: 2,
  //       },
  //       {
  //         text: "Text for line 3.",
  //         role: "Role 1",
  //         key: 3,
  //       },
  //     ],
  //   });
  // });

  it('should display a role picker form when rendered', function () {
    expect(wrapper.queryByTestId("role-picker")).not.toBeNull();
  });

  it('should have it\'s lines hidden initially, before a role is picked', function () {
    const lines: HTMLElement = wrapper.getByTestId("lines");
    expect(lines.style.display).toBe("none");
  });

  it('should mock fetch', function () {
    fetchMock.mockResponseOnce(JSON.stringify({ data: '12345' }));
    const app = render(<App />);
  });


  // it("has a default current line number of 0", () => {
  //   expect(app.instance().state.userRoleLineIndex).toEqual(0);
  // });
  //
  // it("should print all the lines up to the first line of the User1", function () {
  //   // Given that the user role is User1
  //   // And that User1 has the first line in the dialogue
  //   app.instance().setState({
  //     userRole: "Role 0",
  //   });
  //
  //   // Then I expect that the first line in the dialogue will be displayed
  //   expect(app.contains(<Line text={"Text for line 0."} key={0} />)).toBe(true);
  // });
  //
  // it("should print all the lines up to the first line of the User1", function () {
  //   // Given that the user role is User2
  //   // And that User2 has the second line in the dialogue
  //   app.instance().setState({
  //     userRole: "Role 1",
  //   });
  //
  //   // Then I expect that the first and second line in the dialogue will be displayed
  //   expect(app.contains(<Line text={"Text for line 0."} key={0} />)).toBe(true);
  //   expect(app.contains(<Line text={"Text for line 1."} key={1} />)).toBe(true);
  // });
  //
  // it('should print all the lines up to the second line of Role 0 if userRoleLineIndex = 1 and userRole = "Role 0" ', function () {
  //   app.instance().setState({
  //     userRole: "Role 1",
  //     userRoleLineIndex: 1,
  //   });
  //
  //   expect(app.contains(<Line text={"Text for line 0."} key={0} />)).toBe(true);
  //   expect(app.contains(<Line text={"Text for line 1."} key={1} />)).toBe(true);
  //   expect(app.contains(<Line text={"Text for line 2."} key={2} />)).toBe(true);
  //
  // });
  //
  // it("should have a button with text 'Show Next Line'", function () {
  //   const button = app.find(Button);
  //   expect(button).toHaveLength(1);
  //   expect(button.prop("text")).toBe("Show Next Line");
  // });

});

