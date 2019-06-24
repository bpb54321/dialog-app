import React from 'react';
import {App, AppProps, AppState} from "./App";

import Line from "./Line";

// Sample dialog data
import { testDialog } from "./data/test-dialog";
import Button from "./Button";
import {
  fireEvent,
  prettyDOM,
  render, 
  RenderResult,
  waitForElement,
} from "@testing-library/react";
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

  it('should display a role picker form when rendered', function () {
    expect(wrapper.queryByTestId("role-picker")).not.toBeNull();
  });

  it('should have it\'s lines hidden initially, before a role is picked', function () {
    const lines: HTMLElement = wrapper.getByTestId("lines");
    expect(lines.style.display).toBe("none");
  });

  it('should print out the other roles\' lines after a role is picked', async function () {
    fetchMock.mockResponseOnce(JSON.stringify(testDialog));
    const app = render(<App />);

    // Wait for the first role of the test dialog to display in the role picker (which signifies
    // that the data was loaded.
    const roleSelect = await waitForElement(() => app.getByDisplayValue(testDialog.roles[0]));

    // Confirm that the first line of the dialog is not displayed before a user role is picked
    let line0 = app.queryByText(testDialog.lines[0].text);
    expect(line0).toBeNull();

    // Select Role 1 (the second role in testDialog)
    fireEvent.change(roleSelect, {
      target: {
        value: testDialog.roles[1]
      }
    });

    // Click submit to confirm role selection
    fireEvent.click(app.getByTestId("role-picker__submit"));

    app.debug();

    // Wait for line0 to be displayed
    line0 = await waitForElement(() => app.getByText(testDialog.lines[0].text));
  });


});

