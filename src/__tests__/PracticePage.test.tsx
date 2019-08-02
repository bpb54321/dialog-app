import React from 'react';
import {
  cleanup,
  render,
  RenderResult,
  waitForElement,
  waitForElementToBeRemoved,
} from "@testing-library/react";
import {PracticePage} from "../pages/PracticePage";
import {act} from "react-dom/test-utils";
import {GlobalProvider} from "../contexts/GlobalStateContext";
import Role from "../types/Role";

jest.mock("../utils/fetch-data", () => {

  return {
    __esModule: true,
    default: jest.fn( () => {
      return Promise.resolve({
        "name": "Test Dialog",
        "languageCode": "en-US",
        "lines": [
          {
            "text": "This is the text for line 1.",
            "number": 1,
            "role": {
              "id": "abc",
              "name": "Role 1"
            }
          },
          {
            "text": "This is the text for line 2.",
            "number": 2,
            "role": {
              "id": "def",
              "name": "Role 2"
            }
          },
          {
            "text": "This is the text for line 3.",
            "number": 3,
            "role": {
              "id": "abc",
              "name": "Role 1"
            }
          },
          {
            "text": "This is the text for line 4.",
            "number": 4,
            "role": {
              "id": "def",
              "name": "Role 2"
            }
          }
        ]
      });
    })
  };
});

describe('PracticePage', () => {

  let wrapper: RenderResult;
  const match = {
    params: {
      dialogId: "abc"
    }
  };

  let chosenRole: Role;
  const mockSpeechRecognition = {
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    lang: 'en-US',
  };

  beforeEach(async () => {

  });

  afterEach(cleanup);

  test(`Given Role 2 is the chose role
    Then it should print out Role 1's first line`, async function () {

    chosenRole = {
      "id": "def",
      "name": "Role 2"
    };

    act(() => {
      wrapper = render(
        <GlobalProvider speechRecognition={mockSpeechRecognition}
          children={<PracticePage match={match} chosenRole={chosenRole}/>}
        />
      );
    });

    await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));

    await waitForElement(() => wrapper.getByText(/this is the text for line 2/i));
  });

  test(`Given Role 1 is the chosen role
    And the dialog is loaded
    Then no lines should be printed out
    And the user should be presented with the line guess input`, async function () {

    chosenRole = {
      "id": "abc",
      "name": "Role 1"
    };

    act(() => {
      wrapper = render(
        <GlobalProvider speechRecognition={mockSpeechRecognition}
                        children={<PracticePage match={match} chosenRole={chosenRole}/>}
        />
      );
    });

    await waitForElementToBeRemoved(() => wrapper.getByText(/waiting for data to load/i));

    expect(wrapper.queryByText(/this is the text for line 1/i)).toBeNull();

    wrapper.getByPlaceholderText(/text of the next line for role 1/i);
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

