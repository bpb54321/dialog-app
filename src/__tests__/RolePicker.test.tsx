import React from 'react';
import {
    render,
    RenderResult,
    fireEvent,
    cleanup,
} from "@testing-library/react";
import {RolePicker} from "../components/RolePicker";
import Role from "../types/Role";

describe('RolePicker', () => {
    let wrapper: RenderResult;
    let mockFunction: jest.Mock;
    const roles: Role[] = [
        {
            id: "abc",
            name: "Role 0",
        }, {
            id: "def",
            name: "Role 1"
        }
    ];

    const history = {};
    const match = {};

    beforeEach(() => {
        mockFunction = jest.fn();
        wrapper = render(<RolePicker history={history} match={match}/>);
    });

    afterEach(cleanup);

    it(`When the component fetches the roles associated with a given Dialog
        Then it should display the roles as options in it's select element`, function () {

        const firstRoleOption = wrapper.getByText(roles[0]);
        expect(firstRoleOption.tagName).toBe("OPTION");

        const secondRoleOption = wrapper.getByText(roles[1]);
        expect(secondRoleOption.tagName).toBe("OPTION");
    });

    it("should call a function passed to it with the role data as function parameters" +
        " when the submit button is pressed", function () {

        fireEvent.change(wrapper.getByTestId("role-picker__select"), {
            target: {
                value: roles[1],
            },
        });

        fireEvent.click(wrapper.getByTestId("role-picker__submit"));

        expect(mockFunction).toHaveBeenCalledWith(roles[1]);
    });
});
