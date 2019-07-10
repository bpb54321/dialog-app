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

  afterEach(cleanup)

  // it('should call the start() method of the SpeechRecognition object when a user clicks Start Speech Input', function () {
  //   let startSpeechInputButton = wrapper.getByText("Start Speech Input");
  //
  //   fireEvent.click(startSpeechInputButton);
  //
  //   expect(mockSpeechRecognition.start).toHaveBeenCalledTimes(1);
  // });
  //
  // it('should call the stop() method of the SpeechRecognition object when a user clicks Stop Speech Input', function () {
  //   let startSpeechInputButton = wrapper.getByText("Start Speech Input");
  //
  //   fireEvent.click(startSpeechInputButton);
  //
  //   expect(mockSpeechRecognition.start).toHaveBeenCalledTimes(1);
  //
  //   fireEvent.click(startSpeechInputButton);
  //
  //   expect(mockSpeechRecognition.stop).toHaveBeenCalledTimes(1);
  // });

  test("When the user clicks the component, it should call the function updateSpeechRecognitionState", function () {
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

  // it("should toggle its text every time it is clicked", function () {
  //   let button = wrapper.getByText("Start Speech Input");
  //
  //   fireEvent.click(button);
  //
  //   expect(button.textContent).toBe("Stop Speech Input");
  //
  //   fireEvent.click(button);
  //
  //   expect(button.textContent).toBe("Start Speech Input");
  // });

  test("When SpeechRecognitionState.Stopped is passed to it, then it should display Start Speech Input", function () {
    wrapper = render(
      <SpeechInputButton
        updateSpeechRecognitionState={mockUpdateSpeechRecognitionState}
        speechRecognitionState={SpeechRecognitionState.Stopped}
      />
    );

    expect(wrapper.queryByText("Start Speech Input")).not.toBeNull();
  });

  test("When SpeechRecognitionState.Started is passed to it, then it should display Stop Speech Input", function () {
    wrapper = render(
      <SpeechInputButton
        updateSpeechRecognitionState={mockUpdateSpeechRecognitionState}
        speechRecognitionState={SpeechRecognitionState.Started}
      />
    );

    expect(wrapper.queryByText("Stop Speech Input")).not.toBeNull();
  });
});
