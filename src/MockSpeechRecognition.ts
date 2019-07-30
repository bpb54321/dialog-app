/**
 * Mocks the SpeechRecognition interface of the Web Speech API - currently only available on Chrome
 * @link (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
 */

export function createMockSpeechRecognition(): MockSpeechRecognition {
  return {
    start: jest.fn(),
    stop: jest.fn(),
    onresult: null,
    lang: 'en-US',
  };
}

export interface MockSpeechRecognition {
  start: jest.Mock,
  stop: jest.Mock,
  onresult: ((event: any) => void) | null,
  lang: string,
}

