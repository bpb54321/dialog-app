import React from 'react';
import {
    render,
    fireEvent,
    cleanup,
    RenderResult,
} from '@testing-library/react';
import Button from "../Button";

describe('Button', () => {
    let buttonText: string;
    let mockCallback = jest.fn();
    let wrapper: RenderResult;
    let button: Element;

    beforeEach(() => {
        buttonText = "Show Next Line";
        wrapper = render(<Button text={buttonText} handleClick={mockCallback} />);
        button = wrapper.getByTestId("button");
        wrapper.debug();

    });

    afterEach(cleanup);

    it('should render', function () {
        expect(wrapper).not.toBeNull();
    });

    it('should render the button text', function () {
        expect(button.textContent).toBe(buttonText);
    });

    it('calls a function passed to it when clicked', () => {
       fireEvent.click(button);
       expect(mockCallback).toBeCalledTimes(1);
    });

});
