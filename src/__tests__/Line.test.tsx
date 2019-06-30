import React from "react";
import {cleanup, render} from "@testing-library/react";
import Line from "../Line";
import {testDialog} from "../data/test-dialog";

describe('Line', () => {

  afterEach(cleanup);

  it('should render the text passed to it', function () {
    const role = "Role 0";
    const wrapper = render(
      <Line
        key={0}
        text={testDialog.lines[0].text}
        role={role}
      />
    );
    wrapper.getByText(`Line text: ${testDialog.lines[0].text}`);
  });

  it('should display the guess passed to it', function () {
    const guess = "Guess for line 0";
    const role = "Role 0";
    const wrapper = render(
      <Line
        key={0}
        text={testDialog.lines[0].text}
        guess={guess}
        role={role}
      />
    );
    wrapper.getByText(`Guess: ${guess}`);
  });

  it('should display the name of the role that is assigned to the line', function () {
    const guess = "Guess for line 0.";
    const role = "Role 0";
    const text = "This is the text for line 0.";
    const wrapper = render(
      <Line
        key={0}
        text={text}
        guess={guess}
        role={role}
      />
    );

    wrapper.getByText("Role 0");
  });
});

