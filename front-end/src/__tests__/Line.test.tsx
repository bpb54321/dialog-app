import React from "react";
import {cleanup, render, RenderResult} from "@testing-library/react";
import Line from "../components/Line";

describe('Line', () => {

  let wrapper: RenderResult;
  const lineText = "Text for line 0";
  const guess = "Guess for line 0";
  const role = {
    id: "test-role-id",
    name: "Role 0",
  };

  beforeEach(() => {
    wrapper = render(
      <Line
        key={0}
        text={lineText}
        guess={guess}
        role={role}
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
});

