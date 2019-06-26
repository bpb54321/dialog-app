import React from 'react';
import {
    render,
    RenderResult,
    fireEvent,
    waitForElement,
} from "@testing-library/react";
import LineGuess from "../LineGuess";
import {testDialog} from "../data/test-dialog";
import {Simulate} from "react-dom/test-utils";

describe('LineGuess', () => {
    let lineGuess: RenderResult;
    let mockFunction: jest.Mock;
    let guessText: string;

    beforeEach(() => {
        lineGuess = render(<LineGuess lineToGuess={testDialog.lines[0]} />);
        mockFunction = jest.fn();
        guessText = "This is my guess for the line";
    });

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
});
