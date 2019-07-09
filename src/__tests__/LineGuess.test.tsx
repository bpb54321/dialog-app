import React from 'react';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import LineGuess from "../LineGuess";
import {testDialog} from "../data/test-dialog";
import {createMockSpeechRecognitionEvent, mockSpeechRecognition} from "../MockSpeechRecognition";

describe('LineGuess', () => {
  let lineGuess: RenderResult;
  let mockFunction: jest.Mock;
  let guessText: string;
  let userRole: string;

  beforeEach(() => {
    mockFunction = jest.fn();
    guessText = "This is my guess for the line";
    userRole = "Role 0";

    lineGuess = render(
      <LineGuess
        userRole={userRole}
        addLineGuessToLastLine={mockFunction}
        speechRecognition={mockSpeechRecognition}
      />
    );
  });

  afterEach(cleanup)

  it('should render an input with placeholder text that specifies the role', function () {
    lineGuess.getByPlaceholderText(`Text of the next line for ${testDialog.roles[0]}`);
  });

  it("should call a function passed to it with the guess text as function parameters" +
    " when the submit button is pressed", function () {

    const guessInput = lineGuess.getByPlaceholderText(`Text of the next line for ${testDialog.roles[0]}`);
    const guessSubmit = lineGuess.getByText("Submit Guess");

    fireEvent.change(guessInput, {
      target: {
        value: guessText,
      },
    });

    fireEvent.click(guessSubmit);

    expect(mockFunction).toHaveBeenCalledWith(guessText);
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

  it('should call the start() method of the SpeechRecognition object when a user clicks Start Speech Input', function () {
    let startSpeechInputButton = lineGuess.getByText("Start Speech Input");

    fireEvent.click(startSpeechInputButton);

    expect(mockSpeechRecognition.start).toHaveBeenCalledTimes(1);
  });
});
