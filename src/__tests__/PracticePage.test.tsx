import React from 'react';
import {
  cleanup,
  render,
  RenderResult,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import {PracticePage} from "../pages/PracticePage";
import {act} from "react-dom/test-utils";

jest.mock("../utils/fetch-data", () => {

  return jest.fn( () => {

    return Promise.resolve({
      "name": "Test Dialog",
      "languageCode": "en-US",
      "lines": [
        {
          "text": "How's it going?",
          "number": 1,
          "role": {
            "id": "abc",
            "name": "Role 1"
          }
        },
        {
          "text": "Pretty good, how bout yourself?",
          "number": 2,
          "role": {
            "id": "def",
            "name": "Role 2"
          }
        },
        {
          "text": "Could be better.",
          "number": 3,
          "role": {
            "id": "abc",
            "name": "Role 1"
          }
        },
        {
          "text": "Aww, sorry to hear that.",
          "number": 4,
          "role": {
            "id": "def",
            "name": "Role 2"
          }
        }
      ]
    });
  });
});

jest.mock("../contexts/GlobalStateContext", () => {
  const mockSpeechRecognition = {
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    lang: 'en-US',
  };

  return {
    useGlobalState: jest.fn(() => {
      return {
        apiEndpoint: "https://fake-url.com",
        chosenRole: {
          "id": "def",
          "name": "Role 2"
        },
        speechRecognition: mockSpeechRecognition,
        token: "123456"
      };
    }),
  }
});

describe('PracticePage', () => {

  let wrapper: RenderResult;
  const match = {
    params: {
      dialogId: "abc"
    }
  };

  beforeEach(async () => {
    await act((async () => {
      wrapper = render(<PracticePage match={match}/>);

      await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));
    }) as (() => void));
  });

  afterEach(cleanup);

  it("should print out Role 0's first line after Role 1 is picked", function () {

    // /**
    //  * This is because in the test dialog, Role 0 has one line before Role 1's first line.
    //  */
    //
    // // Confirm that the first line of the dialog is not displayed before a user role is picked
    // let line0 = wrapper.queryByText(testDialog.lines[0].text);
    // expect(line0).toBeNull();
    //
    // // Get the role select by searching for an input, textarea, or select with the default role as display value
    // const roleSelect = wrapper.getByDisplayValue(testDialog.roles[0]);
    //
    // // Select Role 1 (the second role in testDialog)
    // fireEvent.change(roleSelect, {
    //   target: {
    //     value: testDialog.roles[1]
    //   }
    // });
    //
    // // Click submit to confirm role selection
    // fireEvent.click(wrapper.getByText("Confirm Role Selection"));
    //
    // // Wait for line0 to be displayed
    // await waitForElement(() => wrapper.getByText(`Line text: ${testDialog.lines[0].text}`));
  });

  it("should not print out any lines after Role 0 is picked", function () {

    // // This is because Role 0 has the first line in our test dialog.
    //
    // // Confirm that the first line of the dialog is not displayed before a user role is picked
    // let line0 = wrapper.queryByText(testDialog.lines[0].text);
    // expect(line0).toBeNull();
    //
    // // Get the role select by searching for an input, textarea, or select with the default role as display value
    // const roleSelect = wrapper.getByDisplayValue(testDialog.roles[0]);
    //
    // // Role 0 (the default role) is already selected
    //
    // // Click submit to confirm role selection
    // fireEvent.click(wrapper.getByText("Confirm Role Selection"));
    //
    // // Wait for the guess input to be displayed
    // await waitForElement(() => wrapper.getByPlaceholderText(`Text of the next line for ` +
    //   `${testDialog.roles[0]}`));
    //
    // // Confirm that the first line of the dialog is still not displayed
    // line0 = wrapper.queryByText(`Line text: ${testDialog.lines[0].text}`);
    // expect(line0).toBeNull();
  });

  it("When Role 0 is picked, Then Role 0 should be asked to enter his first line", function () {

    // // Confirm that the first line of the dialog is not displayed before a user role is picked
    // let line0 = wrapper.queryByText(testDialog.lines[0].text);
    // expect(line0).toBeNull();
    //
    // // Click submit to confirm role selection of default role (Role 0)
    // fireEvent.click(wrapper.getByText("Confirm Role Selection"));
    //
    // const line0Guess = await waitForElement(() => wrapper.getByPlaceholderText(`Text of the next line for ` +
    //   `${testDialog.roles[0]}`));

  });

  it("When I make a guess and submit the guess, the guess and the correct text for " +
    "the line are displayed.", function () {
    //
    // // Click submit to confirm role selection of default role (Role 0)
    // fireEvent.click(wrapper.getByText("Confirm Role Selection"));
    //
    // const line0Guess = await waitForElement(() => wrapper.getByPlaceholderText(`Text of the next line for ` +
    //   `${testDialog.roles[0]}`));
    //
    // const guess = "This is my guess for Line 0";
    //
    // fireEvent.change(line0Guess, {
    //   target: {
    //     value: guess,
    //   }
    // });
    //
    // fireEvent.click(wrapper.getByDisplayValue("Submit Guess"))
    //
    // const line0 = await waitForElement(() => [
    //   wrapper.getByText(`Line text: ${testDialog.lines[0].text}`),
    //   wrapper.getByText(`Guess: ${guess}`),
    // ]);
  });

  it("When I guess my second line, the guess and the correct text for " +
    "the first line and the second line are displayed.", function () {

    // // Click submit to confirm role selection of default role (Role 0)
    // fireEvent.click(wrapper.getByText("Confirm Role Selection"));
    //
    // const guessInput = await waitForElement(() => wrapper.getByPlaceholderText(`Text of the next line for Role 0`));
    // const submitButton = wrapper.getByDisplayValue("Submit Guess");
    //
    // const guessForLine0 = "This is my guess for Line 0";
    //
    // fireEvent.change(guessInput, {
    //   target: {
    //     value: guessForLine0,
    //   }
    // });
    //
    // fireEvent.click(submitButton);
    //
    // await waitForElement(() => [
    //   wrapper.getByText(`Line text: ${testDialog.lines[0].text}`),
    //   wrapper.getByText(`Guess: ${guessForLine0}`),
    // ]);
    //
    // const guessForLine2 = "This is my guess for Line 2.";
    //
    // fireEvent.change(guessInput, {
    //   target: {
    //     value: guessForLine2,
    //   }
    // });
    //
    // fireEvent.click(submitButton);
    //
    // await waitForElement(() => [
    //   wrapper.getByText(`Line text: ${testDialog.lines[2].text}`),
    //   wrapper.getByText(`Guess: ${guessForLine2}`),
    // ]);
  });

  test("Then the app's SpeechRecognition object's language should be set to French.", function() {
    // expect(mockSpeechRecognition.lang).toBe("fr-FR");
  });

  test("Then the app's SpeechRecognition should listen continuously from when the user presses Start Speech Input " +
    "to when he presses Stop Speech Input", function() {
    // expect(mockSpeechRecognition.continuous).toBe(true);
  });

  test("Then the app's SpeechRecognition return interim results", function() {
    // expect(mockSpeechRecognition.interimResults).toBe(true);
  });
});

