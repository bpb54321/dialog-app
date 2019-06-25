import React from "react";
import {render} from "@testing-library/react";
import Line from "../Line";

describe('Line', () => {

  it('should render the text passed to it', function () {
    const text = "Qu'est-ce que tu as envie de manger demain midi?";
    const wrapper = render(<Line key={0} text={text} />);
    wrapper.getByText(text);
  });
});

