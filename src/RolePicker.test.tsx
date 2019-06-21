import React from 'react';
import {render, RenderResult} from "@testing-library/react";
import RolePicker from "./RolePicker";

describe('RolePicker', () => {
    it('should render a form which contains a select and a submit input', function () {
        const wrapper = render(<RolePicker roles={[]}/>);
        wrapper.getByTestId("role-picker");
        wrapper.getByTestId("role-picker__select");
        wrapper.getByTestId("role-picker__submit");
    });

    it('should display the roles passed into as options in it\'s select element', function () {
        const roles = ["Role 0", "Role 1"];
        const wrapper = render(<RolePicker roles={roles} />);
        wrapper.getByText(roles[0]);
        wrapper.getByText(roles[1]);
    });

    it('should call a function passed to it with the form data when the submit button is pressed', function () {
        expect(false).toBe(true);
    });
});