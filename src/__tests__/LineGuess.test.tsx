import React from 'react';
import {
    render,
    RenderResult,
    fireEvent,
    waitForElement,
    cleanup,
} from "@testing-library/react";
import LineGuess from "../LineGuess";
import {testDialog} from "../data/test-dialog";
import {Simulate} from "react-dom/test-utils";

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
            addLineGuessToLastLine={mockFunction}/>
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
});
