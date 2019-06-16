import React from 'react';
import {shallow} from "enzyme";
import Button from "./Button";

describe('Button', () => {

    const buttonText = "Show Next Line";
    let mockCallback = jest.fn();
    const button = shallow(<Button text={buttonText} handleClick={mockCallback}/>);

    it('should render', function () {
        expect(button).not.toBeNull();
    });

    it('should render the button text', function () {
        expect(button.contains(buttonText)).toEqual(true);
    });

    it('calls a function passed to it when clicked', () => {
       let buttonWithCallback = shallow(<Button text={buttonText} handleClick={mockCallback} />);
       buttonWithCallback.find('button').simulate('click');
       expect(mockCallback).toBeCalledTimes(1);
    });

});