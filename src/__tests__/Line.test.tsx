import React from "react";
import {render} from "@testing-library/react";
import Line from "../Line";
import {testDialog} from "../data/test-dialog";

describe('Line', () => {

  it('should render the text passed to it', function () {
    const wrapper = render(<Line key={0} text={testDialog.lines[0].text} />);
    wrapper.getByText(`Line text: ${testDialog.lines[0].text}`);
  });

  it('should display the guess passed to it', function () {
    const guess = "Guess for line 0";
    const wrapper = render(
      <Line
        key={0}
        text={testDialog.lines[0].text}
        guess={guess}
      />
    );
    wrapper.getByText(`Guess: ${guess}`);
  });
});

