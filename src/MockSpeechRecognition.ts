import ChromeWindow from "./types/ChromeWindow";


// let mockSpeechRecognition: SpeechRecognition = new (window as ChromeWindow).webkitSpeechRecognition();

// export default mockSpeechRecognition;

// Mock SpeechRecognition constructor function
// function SpeechRecognition(this: SpeechRecognition) {
//   this.start = function() {};
//   this.stop = function() {};
// }

// let mockSpeechRecognitionIterimResultEvent = {
//   results: [
//     [
//       {
//         transcript: "Blah blah blah",
//       },
//     ],
//   ],
// };

const webkitSpeechRecognition: SpeechRecognition = ({
  start() {},
  stop() {},
} as SpeechRecognition);

function createMockSpeechRecognitionEvent(transcript: string): SpeechRecognitionEvent {
  return {
    emma: null,
    interpretation: null,
    resultIndex: 0,
    results: {
      length: 1,
      item(index: number) {
        return this[index];
      },
      0: {
        isFinal: false,
        length: 1,
        item(index: number) {
          return this[index];
        },
        0: {
          confidence: 0.99,
          transcript: transcript,
        },
      },
    },
  };
}

export const speechRecognition: SpeechRecognition = {} as SpeechRecognition;


// (window as ChromeWindow).webkitSpeechRecognition = jest.fn(() => {
//   return {
//     continuous: false,
//     grammars: {
//       length: 0,
//       addFromString: (string: string, weight?: number) => {},
//       addFromURI: (src: string, weight?: number) => {},
//       item: (index: number) => ({} as SpeechGrammar),
//     },
//     interimResults: false,
//     lang: "",
//     maxAlternatives: 1,
//     onaudioend: null,
//     onaudiostart: null,
//     onend: null,
//     onerror: null,
//     onnomatch: null,
//     onresult: null,
//     onsoundend: null,
//     onsoundstart: null,
//     onspeechend: null,
//     onspeechstart: null,
//     onstart: null,
//     serviceURI: "",
//     abort: () => {},
//     start: () => {},
//     stop: () => {},
//     dispatchEvent: (event: Event) => true,
//   };
// });

// (window as ChromeWindow).webkitSpeechRecognition = jest.fn(() => {
//   return ({} as SpeechRecognition);
// });

