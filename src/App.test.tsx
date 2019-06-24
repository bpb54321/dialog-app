import React from 'react';
import {App} from "./App";

// Sample dialog data
import { testDialog } from "./data/test-dialog";
import {
  cleanup,
  fireEvent,
  prettyDOM,
  render,
  RenderResult,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import {FetchMock} from "jest-fetch-mock";
const fetchMock = fetch as FetchMock;

describe('App', () => {

  let app: RenderResult;
  let appInstance: App;

  beforeEach(async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(testDialog));
    app = render(<App />);
    app.debug();
    await waitForElementToBeRemoved(() => app.getByTestId("loading-message"));
  });

  afterEach(cleanup);

  it("should calculate the line numbers for the user's role", function () {

    appInstance = new App({});

    // Check that the line numbers for Role 0 are correct
    const roleOLineNumbers = appInstance.calculateUserLineNumbers(testDialog, "Role 0");

    expect(roleOLineNumbers).toEqual([0, 2]);

    // Check that the line numbers for Role 1 are correct
    const role1LineNumbers = appInstance.calculateUserLineNumbers(testDialog, "Role 1");

    expect(role1LineNumbers).toEqual([1, 3]);

  });

  it('should display a role picker when rendered', async function () {
    app.debug();
    await waitForElement(() => app.getByTestId("role-picker"));
  });

  it('should have it\'s lines not shown initially, before a role is picked', async function () {
    const lines = app.queryAllByTestId("line");
    expect(lines).toEqual([]);
  });

  /**
   * This is because in the test dialog, Role 0 has one line before Role 1's first line.
   */
  it("should print out Role 0's first line after Role 1 is picked", async function () {
    // Confirm that the first line of the dialog is not displayed before a user role is picked
    let line0 = app.queryByText(testDialog.lines[0].text);
    expect(line0).toBeNull();

    const roleSelect = app.getByTestId("role-picker__select");

    // Select Role 1 (the second role in testDialog)
    fireEvent.change(roleSelect, {
      target: {
        value: testDialog.roles[1]
      }
    });

    // Click submit to confirm role selection
    fireEvent.click(app.getByTestId("role-picker__submit"));

    // Wait for line0 to be displayed
    await waitForElement(() => app.getByText(testDialog.lines[0].text));
  });

  /**
   * This is because Role 0 has the first line, so the app has no lines to print before the user
   * has to guess his line.
   */
  it("When Role 0 is picked, Then Role 0 should be asked to enter his first line", async function () {
    // Confirm that the first line of the dialog is not displayed before a user role is picked
    let line0 = app.queryByText(testDialog.lines[0].text);
    expect(line0).toBeNull();

    // Click submit to confirm role selection of default role (Role 0)
    fireEvent.click(app.getByTestId("role-picker__submit"));

    const line0Guess = await waitForElement(() => app.getByTestId("line-guess"));

  });


});

