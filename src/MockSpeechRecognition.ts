/**
 * Returns a mocked version of a SpeechRecognitionEvent.
 * @link (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognitionEvent)
 * @param transcript - The string that you want the primary SpeechRecognitionAlternative in your mocked
 * SpeechRecognitionEvent to have.
 */
export function createMockSpeechRecognitionEvent(transcript: string): any {
  return {
    results: [
      [
        {
          transcript: transcript,
        },
      ],
    ],
  };
}


/**
 * Mocks the SpeechRecognition interface of the Web Speech API - currently only available on Chrome
 * @link (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
 */
export const mockSpeechRecognition: any = {
  start: function() {},
  stop: function() {},
  onresult: undefined,
};

