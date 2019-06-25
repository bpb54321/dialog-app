import React from 'react';
import {
    render,
    RenderResult,
    fireEvent,
    waitForElement, cleanup,
} from "@testing-library/react";
import RolePicker from "../RolePicker";
import {testDialog} from "../data/test-dialog";

describe('RolePicker', () => {
    let rolePicker: RenderResult;
    let mockFunction: jest.Mock;
    const roles: string[] = ["Role 0", "Role 1"];

    beforeEach(() => {
        mockFunction = jest.fn();
        rolePicker = render(<RolePicker roles={roles} setUserRoleAndChangeMode={mockFunction}/>);
    });

    afterEach(cleanup);

    it('should render a form which contains a select and a submit input', function () {
        rolePicker.getByTestId("role-picker");
        rolePicker.getByTestId("role-picker__select");
        rolePicker.getByTestId("role-picker__submit");
    });

    it("should display the roles passed into as options in it's select element", function () {
        const firstRoleOption = rolePicker.getByText(roles[0]);
        expect(firstRoleOption.tagName).toBe("OPTION");

        const secondRoleOption = rolePicker.getByText(roles[1]);
        expect(secondRoleOption.tagName).toBe("OPTION");
    });

    it("should call a function passed to it with the role data as function parameters" +
        " when the submit button is pressed", function () {

        fireEvent.change(rolePicker.getByTestId("role-picker__select"), {
            target: {
                value: roles[1],
            },
        });

        fireEvent.click(rolePicker.getByTestId("role-picker__submit"));

        expect(mockFunction).toHaveBeenCalledWith(roles[1]);
    });
});
