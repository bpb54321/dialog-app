import React from 'react';
import {
  render,
  RenderResult,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import {mockSpeechRecognition} from "../MockSpeechRecognition";
import SpeechInputButton from "../SpeechInputButton";

describe('SpeechInputButton', () => {
  let wrapper: RenderResult;

  beforeEach(() => {
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
});
