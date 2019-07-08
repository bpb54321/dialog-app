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

export const speechRecognition: any = {
  start: function() {},
  stop: function() {},
  onresult: undefined,
};

