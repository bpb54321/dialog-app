import React from "react";
import {
  cleanup,
  render,
  RenderResult,
  fireEvent
} from "@testing-library/react";
import {Line} from "../components/Line";

describe('Line', () => {

  let wrapper: RenderResult;
  const lineText = "Text for line 0";
  const guess = "Guess for line 0";
  const role = {
    id: "test-role-id",
    name: "Role 0",
  };
  let mockIncrementLine = jest.fn();

  beforeEach(() => {
    wrapper = render(
      <Line
        key={0}
        text={lineText}
        guess={guess}
        role={role}
        incrementLine={mockIncrementLine}
      />
    );
  });

  afterEach(cleanup);

  it('should render the text passed to it', function () {
    wrapper.getByText(`Line text: ${lineText}`);
  });

  it('should display the guess passed to it', function () {
    wrapper.getByText(`Guess: ${guess}`);
  });

  it('should display the name of the role that is assigned to the line', function () {
    wrapper.getByText(role.name);
  });

  test(`When the component is rendered with showNext not set
      Then the Next Line button should not be rendered`, () => {
    expect(wrapper.queryByText(/next line/i)).toBeNull();
  });

  test(`When the component is rendered with showNext = true
      When I click on the Next Line button,
      Then it should call a function passed to it`, () => {
        wrapper = render(
          <Line
            key={0}
            text={lineText}
            guess={guess}
            role={role}
            showNext={true}
            incrementLine={mockIncrementLine}
          />
        );

        fireEvent.click(wrapper.getByText(/next line/i));

        expect(mockIncrementLine).toHaveBeenCalledTimes(1);
  })
});

