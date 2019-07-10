import React from 'react';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import LineGuess from "../LineGuess";
import {testDialog} from "../data/test-dialog";
import {createMockSpeechRecognition} from "../MockSpeechRecognition";

describe('LineGuess', () => {
  let lineGuess: RenderResult;
  let mockAddLineGuessToLastLine: jest.Mock;
  let guessText: string;
  let userRole: string;
  let mockSpeechRecognition: any;

  beforeEach(() => {
    mockAddLineGuessToLastLine = jest.fn();
    guessText = "This is my guess for the line";
    userRole = "Role 0";
    mockSpeechRecognition = createMockSpeechRecognition();

    lineGuess = render(
      <LineGuess
        userRole={userRole}
        addLineGuessToLastLine={mockAddLineGuessToLastLine}
        speechRecognition={mockSpeechRecognition}
      />
    );
  });

  afterEach(cleanup)

  it('should render an input with placeholder text that specifies the role', function () {
    lineGuess.getByPlaceholderText(`Text of the next line for ${testDialog.roles[0]}`);
  });

  it("When the submit button is pressed, the function which adds the guess to the line should be called with "
    + "the current value of the guess.", function () {

    const guessInput = lineGuess.getByPlaceholderText(`Text of the next line for ${testDialog.roles[0]}`);
    const guessSubmit = lineGuess.getByText("Submit Guess");

    fireEvent.change(guessInput, {
      target: {
        value: guessText,
      },
    });

    fireEvent.click(guessSubmit);

    expect(mockAddLineGuessToLastLine).toHaveBeenCalledWith(guessText);
  });

  it("when the speech recognition input button is pressed, then the component should not call the function " +
    "which adds the guess to the line", function() {
    let startSpeechInputButton = lineGuess.getByText("Start Speech Input");

    fireEvent.click(startSpeechInputButton);

    expect(mockAddLineGuessToLastLine).toHaveBeenCalledTimes(0);
  });

  it('should reset the guess to an empty string after a guess is submitted', function () {
    const guessInput = lineGuess.getByPlaceholderText(`Text of the next line for ${testDialog.roles[0]}`) as
      HTMLInputElement;
    const guessSubmit = lineGuess.getByText("Submit Guess");


    fireEvent.change(guessInput, {
      target: {
        value: guessText,
      },
    });

    fireEvent.click(guessSubmit);

    expect(guessInput.value).toBe("");

  });

  it("When the user submits the guess, Then speech recognition button should be reset to 'Start Speech Input' " +
    "And the stop() method on the SpeechRecognition object should be automatically called.", function () {
    let startSpeechInputButton = lineGuess.getByText("Start Speech Input");

    fireEvent.click(startSpeechInputButton);

    let submitButton = lineGuess.getByText("Submit Guess");

    fireEvent.click(submitButton);

    expect(lineGuess.queryByText("Start Speech Input")).not.toBeNull();

    expect(mockSpeechRecognition.stop).toHaveBeenCalledTimes(1);
  });

  it('should allow the user to transcribe speech input for their guess', function () {
    let startSpeechInputButton = lineGuess.getByText("Start Speech Input");

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
    mockSpeechRecognition.onresult(mockSpeechRecognitionResultEvent1);

    // The value of the LineGuess input should have the spoken phrase
    expect(lineGuess.queryByDisplayValue("first spoken phrase")).not.toBeNull();

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
    mockSpeechRecognition.onresult(mockSpeechRecognitionResultEvent2);

    expect(lineGuess.queryByDisplayValue("first spoken phrase second spoken phrase")).not.toBeNull();
  });


});
