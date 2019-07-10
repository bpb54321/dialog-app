import React from 'react';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import {createMockSpeechRecognition} from "../MockSpeechRecognition";
import SpeechInputButton from "../SpeechInputButton";

describe('SpeechInputButton', () => {
  let wrapper: RenderResult;
  let mockSpeechRecognition: any;

  beforeEach(() => {
    mockSpeechRecognition = createMockSpeechRecognition();
    wrapper = render(
      <SpeechInputButton
        speechRecognition={mockSpeechRecognition}
      />
    );
  });

  afterEach(cleanup)

  it('should call the start() method of the SpeechRecognition object when a user clicks Start Speech Input', function () {
    let startSpeechInputButton = wrapper.getByText("Start Speech Input");

    fireEvent.click(startSpeechInputButton);

    expect(mockSpeechRecognition.start).toHaveBeenCalledTimes(1);
  });

  it('should call the stop() method of the SpeechRecognition object when a user clicks Stop Speech Input', function () {
    let startSpeechInputButton = wrapper.getByText("Start Speech Input");

    fireEvent.click(startSpeechInputButton);

    expect(mockSpeechRecognition.start).toHaveBeenCalledTimes(1);

    fireEvent.click(startSpeechInputButton);

    expect(mockSpeechRecognition.stop).toHaveBeenCalledTimes(1);
  });

  it("should toggle its text every time it is clicked", function () {
    let button = wrapper.getByText("Start Speech Input");

    fireEvent.click(button);

    expect(button.textContent).toBe("Stop Speech Input");

    fireEvent.click(button);

    expect(button.textContent).toBe("Start Speech Input");
  });
});
