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

    beforeEach(() => {
        lineGuess = render(<LineGuess lineToGuess={testDialog.lines[0]} />);
    });

    it('should render an input with placeholder text that specifies the role', function () {
        lineGuess.getByPlaceholderText(`Text of the next line for ${testDialog.roles[0]}`);
    });
});
