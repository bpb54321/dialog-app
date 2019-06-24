import React from 'react';
import {
    render,
    RenderResult,
    fireEvent,
    waitForElement,
} from "@testing-library/react";
import LineGuess from "./LineGuess";
import {testDialog} from "./data/test-dialog";

describe('LineGuess', () => {
    it('should render a form which contains a label, text input, and submit input', function () {
        const lineGuess = render(<LineGuess lineToGuess={testDialog.lines[0]} />);
        lineGuess.getByTestId("line-guess__label");
        lineGuess.getByTestId("line-guess__text-input");
        lineGuess.getByTestId("line-guess__submit");
    });
});
