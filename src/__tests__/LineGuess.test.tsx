import React from 'react';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
  waitForElement
} from "@testing-library/react";
import {LineGuess} from "../LineGuess";
import {createMockSpeechRecognition, MockSpeechRecognition} from "../__mocks__/MockSpeechRecognition";
import Role from "../types/Role";
import {act} from "react-dom/test-utils";
import {SpeechRecognition} from "../__mocks__/SpeechRecognition";

jest.mock("../__mocks__/SpeechRecognition");

(window as any).webkitSpeechRecognition = SpeechRecognition;

describe('LineGuess', () => {
  let wrapper: RenderResult;
  let mockAddLineGuessToLastLine: jest.Mock;
  let userRole: Role;
  let mockSpeechRecognition: MockSpeechRecognition;
  let guessText: string;
  let guessInput: HTMLInputElement;
  let submitButton: HTMLInputElement;
  let startSpeechInputButton: HTMLButtonElement;

  beforeEach(async () => {
    mockAddLineGuessToLastLine = jest.fn();
    guessText = "This is my guess for the line";
    userRole = {
      id: "abcdef",
      name: "Role 0"
    };

    // act(() => {
      wrapper = render(
        <LineGuess
          chosenRole={userRole}
          addLineGuessToLastLine={mockAddLineGuessToLastLine}
          dialogLanguageCode={"fr-FR"}
        />
      );
    // });

    const placeholderText = `Text of the next line for ${userRole.name}`;
    guessInput = (wrapper.getByPlaceholderText(placeholderText) as HTMLInputElement);
    submitButton = (wrapper.getByText("Submit Guess") as HTMLInputElement);
    startSpeechInputButton = (wrapper.getByText("Start Speech Input") as HTMLButtonElement);
    await waitForElement(() => wrapper.getByText(/start speech input/i));

  });

  afterEach(cleanup);

  test(`
    Given the dialog's language is "fr-FR",
    Then the component's SpeechRecognition object's language should be set to "fr-FR"
    And the other settings on the SpeechRecognition's object should be set in a certain way`, function() {
    expect((window as any).webkitSpeechRecognition.mock.instances[0].lang).toBe("fr-FR");
    expect((window as any).webkitSpeechRecognition.mock.instances[0].interimResults).toBe(true);
    expect((window as any).webkitSpeechRecognition.mock.instances[0].maxAlternatives).toBe(1);
    expect((window as any).webkitSpeechRecognition.mock.instances[0].continuous).toBe(true);
  });

  test("Then the app's SpeechRecognition should listen continuously from when the user presses Start Speech Input " +
    "to when he presses Stop Speech Input", function() {
    // expect(mockSpeechRecognition.continuous).toBe(true);
  });

  test("Then the app's SpeechRecognition return interim results", function() {
    // expect(mockSpeechRecognition.interimResults).toBe(true);
  });

  it(`When the submit button is pressed
    Then the component should call the function which adds the guess to the line with the current value of the guess`,
    function () {

    fireEvent.change(guessInput, {
      target: {
        value: guessText,
      },
    });

    fireEvent.click(submitButton);

    expect(mockAddLineGuessToLastLine).toHaveBeenCalledWith(guessText);
  });

  it(`When the speech recognition input button is pressed
    Then the component should NOT call the function which adds the guess to the line`, function() {

    const startSpeechInputButton = wrapper.getByText("Start Speech Input");

    fireEvent.click(startSpeechInputButton);

    expect(mockAddLineGuessToLastLine).toHaveBeenCalledTimes(0);

  });

  it(`When a guess is submitted,
    Then the component should reset the guess to an empty string`, function () {

    fireEvent.change(guessInput, {
      target: {
        value: guessText,
      },
    });

    fireEvent.click(submitButton);

    expect(guessInput.value).toBe("");

  });

  it(`When the user submits the guess,
    Then speech recognition button should be reset to 'Start Speech Input'
    And the stop() method on the SpeechRecognition object should be automatically called.`, function () {

    fireEvent.click(startSpeechInputButton);

    fireEvent.click(submitButton);

    expect(mockSpeechRecognition.stop).toHaveBeenCalledTimes(1);

    expect(wrapper.queryByText("Start Speech Input")).not.toBeNull();

  });

  it(`When the user clicks the Start Speech button
    And he starts speaking into the mic
    Then the component should transcribe the user's speech into the text input`, function () {

    fireEvent.click(startSpeechInputButton);

    // Pretend like a user spoke into the mike
    const mockSpeechRecognitionResultEvent1 = {
      results: [
        [
          {
            transcript: "first spoken phrase",
          },
        ],
      ],
    };

    if (mockSpeechRecognition.onresult) {
      mockSpeechRecognition.onresult(mockSpeechRecognitionResultEvent1);
    }

    // The value of the LineGuess input should have the spoken phrase
    expect(wrapper.queryByDisplayValue("first spoken phrase")).not.toBeNull();

    // Pretend like the user spoke a second phrase
    // (space at beginning of phrase is intentional, the SpeechRecognition api adds a space when there is silence in
    // the speech input
    const mockSpeechRecognitionResultEvent2 = {
      results: [
        [
          {
            transcript: "first spoken phrase",
          },
        ],
        [
          {
            transcript: " second spoken phrase",
          },
        ],
      ],
    };
    if (mockSpeechRecognition.onresult) {
      mockSpeechRecognition.onresult(mockSpeechRecognitionResultEvent2);
    }

    expect(wrapper.queryByDisplayValue("first spoken phrase second spoken phrase")).not.toBeNull();
  });

  test(`When the Start Speech Input button is clicked
    Then the button text should toggle back and forth between Start and Stop`, function () {

    fireEvent.click(startSpeechInputButton);

    expect(startSpeechInputButton.textContent).toBe("Stop Speech Input");

    fireEvent.click(startSpeechInputButton);

    expect(startSpeechInputButton.textContent).toBe("Start Speech Input");

  });

  test(`When a user clicks Start Speech Input
    Then it should call the start() method of the SpeechRecognition object`, function () {

    fireEvent.click(startSpeechInputButton);

    expect(mockSpeechRecognition.start).toHaveBeenCalledTimes(1);

  });

  test(`When a user clicks Stop Speech Input
    Then it should call the stop() method of the SpeechRecognition object`, function () {

    fireEvent.click(startSpeechInputButton);

    fireEvent.click(startSpeechInputButton);

    expect(mockSpeechRecognition.stop).toHaveBeenCalledTimes(1);

  });

});
