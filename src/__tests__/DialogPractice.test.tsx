import React from 'react';
import {App} from "../App";

// Sample dialog data
import { testDialogsResponse, testRolesResponse } from "../data/test-dialog";
import {
  cleanup,
  fireEvent,
  render,
  RenderResult,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import {FetchMock} from "jest-fetch-mock";
import {createMockSpeechRecognition} from "../MockSpeechRecognition";
const fetchMock = fetch as FetchMock;

describe('DialogPractice', () => {

  let wrapper: RenderResult;
  let appInstance: App;
  let mockSpeechRecognition: any;

  beforeEach(async () => {
    fetchMock.resetMocks();
    fetchMock.mockResponseOnce(JSON.stringify(testDialogsResponse));
    mockSpeechRecognition = createMockSpeechRecognition();
    wrapper = render(<App speechRecognition={mockSpeechRecognition}/>);
    await waitForElementToBeRemoved(() => wrapper.getByText("Waiting for data to load..."));
  });

  afterEach(cleanup);

  test("When the app is loaded, " +
    "Then a list of available dialogs should be displayed.", function () {

    wrapper.getByText("Test Dialog 0");
    wrapper.getByText("Test Dialog 1");

  });

  it("should calculate the line numbers for the user's role", function () {

    appInstance = new App({
      speechRecognition: mockSpeechRecognition,
    });

    // Check that the line numbers for Role 0 are correct
    const roleOLineNumbers = appInstance.calculateUserLineNumbers(testDialogsResponse[0], "Role 0");

    expect(roleOLineNumbers).toEqual([0, 2]);

    // Check that the line numbers for Role 1 are correct
    const role1LineNumbers = appInstance.calculateUserLineNumbers(testDialog, "Role 1");

    expect(role1LineNumbers).toEqual([1, 3]);

  });

  it("should display a role picker when rendered", async function () {
    wrapper.getByText("Role Picker");
  });

  it("should not show any lines before a role is picked", async function () {

    const lines = testDialog.lines;

    for (const line of lines) {
      expect(wrapper.queryByText(line.text)).toBeNull();
    }
  });

  it("should print out Role 0's first line after Role 1 is picked", async function () {

    /**
     * This is because in the test dialog, Role 0 has one line before Role 1's first line.
     */

    // Confirm that the first line of the dialog is not displayed before a user role is picked
    let line0 = wrapper.queryByText(testDialog.lines[0].text);
    expect(line0).toBeNull();

    // Get the role select by searching for an input, textarea, or select with the default role as display value
    const roleSelect = wrapper.getByDisplayValue(testDialog.roles[0]);

    // Select Role 1 (the second role in testDialog)
    fireEvent.change(roleSelect, {
      target: {
        value: testDialog.roles[1]
      }
    });

    // Click submit to confirm role selection
    fireEvent.click(wrapper.getByText("Confirm Role Selection"));

    // Wait for line0 to be displayed
    await waitForElement(() => wrapper.getByText(`Line text: ${testDialog.lines[0].text}`));
  });

  it("should not print out any lines after Role 0 is picked", async function () {

    // This is because Role 0 has the first line in our test dialog.

    // Confirm that the first line of the dialog is not displayed before a user role is picked
    let line0 = wrapper.queryByText(testDialog.lines[0].text);
    expect(line0).toBeNull();

    // Get the role select by searching for an input, textarea, or select with the default role as display value
    const roleSelect = wrapper.getByDisplayValue(testDialog.roles[0]);

    // Role 0 (the default role) is already selected

    // Click submit to confirm role selection
    fireEvent.click(wrapper.getByText("Confirm Role Selection"));

    // Wait for the guess input to be displayed
    await waitForElement(() => wrapper.getByPlaceholderText(`Text of the next line for ` +
      `${testDialog.roles[0]}`));

    // Confirm that the first line of the dialog is still not displayed
    line0 = wrapper.queryByText(`Line text: ${testDialog.lines[0].text}`);
    expect(line0).toBeNull();
  });

  it("When Role 0 is picked, Then Role 0 should be asked to enter his first line", async function () {

    // Confirm that the first line of the dialog is not displayed before a user role is picked
    let line0 = wrapper.queryByText(testDialog.lines[0].text);
    expect(line0).toBeNull();

    // Click submit to confirm role selection of default role (Role 0)
    fireEvent.click(wrapper.getByText("Confirm Role Selection"));

    const line0Guess = await waitForElement(() => wrapper.getByPlaceholderText(`Text of the next line for ` +
      `${testDialog.roles[0]}`));

  });

  it("When I make a guess and submit the guess, the guess and the correct text for " +
    "the line are displayed.", async function () {

    // Click submit to confirm role selection of default role (Role 0)
    fireEvent.click(wrapper.getByText("Confirm Role Selection"));

    const line0Guess = await waitForElement(() => wrapper.getByPlaceholderText(`Text of the next line for ` +
      `${testDialog.roles[0]}`));

    const guess = "This is my guess for Line 0";

    fireEvent.change(line0Guess, {
      target: {
        value: guess,
      }
    });

    fireEvent.click(wrapper.getByDisplayValue("Submit Guess"))

    const line0 = await waitForElement(() => [
      wrapper.getByText(`Line text: ${testDialog.lines[0].text}`),
      wrapper.getByText(`Guess: ${guess}`),
    ]);
  });

  it("When I guess my second line, the guess and the correct text for " +
    "the first line and the second line are displayed.", async function () {

    // Click submit to confirm role selection of default role (Role 0)
    fireEvent.click(wrapper.getByText("Confirm Role Selection"));

    const guessInput = await waitForElement(() => wrapper.getByPlaceholderText(`Text of the next line for Role 0`));
    const submitButton = wrapper.getByDisplayValue("Submit Guess");

    const guessForLine0 = "This is my guess for Line 0";

    fireEvent.change(guessInput, {
      target: {
        value: guessForLine0,
      }
    });

    fireEvent.click(submitButton);

    await waitForElement(() => [
      wrapper.getByText(`Line text: ${testDialog.lines[0].text}`),
      wrapper.getByText(`Guess: ${guessForLine0}`),
    ]);

    const guessForLine2 = "This is my guess for Line 2.";

    fireEvent.change(guessInput, {
      target: {
        value: guessForLine2,
      }
    });

    fireEvent.click(submitButton);

    await waitForElement(() => [
      wrapper.getByText(`Line text: ${testDialog.lines[2].text}`),
      wrapper.getByText(`Guess: ${guessForLine2}`),
    ]);
  });

  test("Then the app's SpeechRecognition object's language should be set to French.", function() {
    expect(mockSpeechRecognition.lang).toBe("fr-FR");
  });

  test("Then the app's SpeechRecognition should listen continuously from when the user presses Start Speech Input " +
    "to when he presses Stop Speech Input", function() {
    expect(mockSpeechRecognition.continuous).toBe(true);
  });

  test("Then the app's SpeechRecognition return interim results", function() {
    expect(mockSpeechRecognition.interimResults).toBe(true);
  });
});

