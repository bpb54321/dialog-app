import React from 'react';
import {
    render,
    RenderResult,
    fireEvent,
    waitForElement,
} from "@testing-library/react";
import RolePicker from "./RolePicker";
import {testDialog} from "./data/test-dialog";

describe('RolePicker', () => {
    it('should render a form which contains a select and a submit input', function () {
        const wrapper = render(<RolePicker roles={[]}/>);
        wrapper.getByTestId("role-picker");
        wrapper.getByTestId("role-picker__select");
        wrapper.getByTestId("role-picker__submit");
    });

    it('should display the roles passed into as <option>\'s in it\'s select element', function () {
        const roles = ["Role 0", "Role 1"];
        const wrapper = render(<RolePicker roles={roles} />);
        wrapper.getByText(roles[0]);
        wrapper.getByText(roles[1]);
    });

    it("should call a function passed to it with the form data as function parameters" +
        " when the submit button is pressed", function () {
        // I need to mock a function
        const mockFunction = jest.fn();
        const rolePicker = render(<RolePicker roles={testDialog.roles} onSubmit={mockFunction}/>);

        fireEvent.change(rolePicker.getByTestId("role-picker__select"), {
            target: {
                value: "Role 1",
            },
        });

        fireEvent.click(rolePicker.getByTestId("role-picker__submit"));

        expect(mockFunction).toHaveBeenCalledWith("Role 1");
    });
});