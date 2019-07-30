import React from 'react';
import {cleanup, fireEvent, render, RenderResult,} from "@testing-library/react";
import SpeechInputButton from "../SpeechInputButton";
import {SpeechRecognitionState} from "../types/SpeechRecognitionState";

describe('SpeechInputButton', () => {
  let wrapper: RenderResult;
  let mockUpdateSpeechRecognitionState: jest.Mock;

  beforeEach(() => {
    mockUpdateSpeechRecognitionState = jest.fn();
  });

  afterEach(cleanup);

  test(`When the user clicks the component
    Then it should call the function updateSpeechRecognitionState`, function () {
    wrapper = render(
      <SpeechInputButton
        updateSpeechRecognitionState={mockUpdateSpeechRecognitionState}
        speechRecognitionState={SpeechRecognitionState.Stopped}
      />
    );

    let startSpeechInputButton = wrapper.getByText("Start Speech Input");

    fireEvent.click(startSpeechInputButton);

    expect(mockUpdateSpeechRecognitionState).toHaveBeenCalledTimes(1);
  });

  test(
    `When SpeechRecognitionState.Stopped is passed to it
    Then it should display "Start Speech Input"`, function () {
    wrapper = render(
      <SpeechInputButton
        updateSpeechRecognitionState={mockUpdateSpeechRecognitionState}
        speechRecognitionState={SpeechRecognitionState.Stopped}
      />
    );

    expect(wrapper.queryByText("Start Speech Input")).not.toBeNull();
  });

  test(`When SpeechRecognitionState.Started is passed to it
    Then it should display "Stop Speech Input"`, function () {
    wrapper = render(
      <SpeechInputButton
        updateSpeechRecognitionState={mockUpdateSpeechRecognitionState}
        speechRecognitionState={SpeechRecognitionState.Started}
      />
    );

    expect(wrapper.queryByText("Stop Speech Input")).not.toBeNull();
  });
});
