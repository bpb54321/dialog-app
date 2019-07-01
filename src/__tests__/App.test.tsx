import React from 'react';
import {App} from "../App";

// Sample dialog data
import { testDialog } from "../data/test-dialog";
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
    await waitForElementToBeRemoved(() => app.getByText("Waiting for the dialog to load..."));
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

  it("should display a role picker when rendered", async function () {
    app.getByText("Role Picker");
  });

  it("should not show any lines before a role is picked", async function () {

    const lines = testDialog.lines;

    for (const line of lines) {
      expect(app.queryByText(line.text)).toBeNull();
    }
  });


  it("should print out Role 0's first line after Role 1 is picked", async function () {

    /**
     * This is because in the test dialog, Role 0 has one line before Role 1's first line.
     */

    // Confirm that the first line of the dialog is not displayed before a user role is picked
    let line0 = app.queryByText(testDialog.lines[0].text);
    expect(line0).toBeNull();

    // Get the role select by searching for an input, textarea, or select with the default role as display value
    const roleSelect = app.getByDisplayValue(testDialog.roles[0]);

    // Select Role 1 (the second role in testDialog)
    fireEvent.change(roleSelect, {
      target: {
        value: testDialog.roles[1]
      }
    });

    // Click submit to confirm role selection
    fireEvent.click(app.getByText("Confirm Role Selection"));

    // Wait for line0 to be displayed
    await waitForElement(() => app.getByText(testDialog.lines[0].text));
  });

  it("When Role 0 is picked, Then Role 0 should be asked to enter his first line", async function () {

    // Confirm that the first line of the dialog is not displayed before a user role is picked
    let line0 = app.queryByText(testDialog.lines[0].text);
    expect(line0).toBeNull();

    // Click submit to confirm role selection of default role (Role 0)
    fireEvent.click(app.getByText("Confirm Role Selection"));

    const line0Guess = await waitForElement(() => app.getByPlaceholderText(`Text of the next line for ` +
      `${testDialog.roles[0]}`));

  });

  it("When I make a guess and submit the guess, the guess and the correct text for " +
    "the line are displayed.", async function () {

    // Click submit to confirm role selection of default role (Role 0)
    fireEvent.click(app.getByText("Confirm Role Selection"));

    const line0Guess = await waitForElement(() => app.getByPlaceholderText(`Text of the next line for ` +
      `${testDialog.roles[0]}`));

    const guess = "This is my guess for Line 0";

    fireEvent.change(line0Guess, {
      target: {
        value: guess,
      }
    });

    fireEvent.click(app.getByDisplayValue("Submit Guess"))

    const line0 = await waitForElement(() => [
      app.getByText(`Line text: ${testDialog.lines[0].text}`),
      app.getByText(`Guess: ${guess}`),
    ]);
  });

  it("When I guess my second line, the guess and the correct text for " +
    "the first line and the second line are displayed.", async function () {

    // Click submit to confirm role selection of default role (Role 0)
    fireEvent.click(app.getByText("Confirm Role Selection"));

    const guessInput = await waitForElement(() => app.getByPlaceholderText(`Text of the next line for Role 0`));
    const submitButton = app.getByDisplayValue("Submit Guess");

    const guessForLine0 = "This is my guess for Line 0";

    fireEvent.change(guessInput, {
      target: {
        value: guessForLine0,
      }
    });

    fireEvent.click(submitButton);

    const line0 = await waitForElement(() => [
      app.getByText(`Line text: ${testDialog.lines[0].text}`),
      app.getByText(`Guess: ${guessForLine0}`),
    ]);

    const guessForLine2 = "This is my guess for Line 2.";

    fireEvent.change(guessInput, {
      target: {
        value: guessForLine2,
      }
    });

    fireEvent.click(submitButton);

    const line2 = await waitForElement(() => [
      app.getByText(`Line text: ${testDialog.lines[2].text}`),
      app.getByText(`Guess: ${guessForLine2}`),
    ]);
  });


});

