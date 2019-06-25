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
    it('should render a form which contains a label, text input, and submit input', function () {
        const wrapper = render(<LineGuess lineToGuess={testDialog.lines[0]} />);

        const lineGuess = wrapper.getByTestId("line-guess");
        expect(lineGuess.tagName).toBe("FORM");

        const label = wrapper.getByTestId("line-guess__label");
        expect(label.tagName).toBe("LABEL");

        const textInput = wrapper.getByTestId("line-guess__text-input");
        expect(textInput.tagName).toBe("INPUT");
        expect((textInput as HTMLInputElement).type).toBe("text");

        const submit = wrapper.getByTestId("line-guess__submit");
        expect(submit.tagName).toBe("INPUT");
        expect((submit as HTMLInputElement).type).toBe("submit");
        expect((submit as HTMLInputElement).value).toBe("Guess");
    });
});
