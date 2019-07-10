/**
 * Mocks the SpeechRecognition interface of the Web Speech API - currently only available on Chrome
 * @link (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
 */
export function createMockSpeechRecognition(): any {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    onresult: undefined,
  };
}

