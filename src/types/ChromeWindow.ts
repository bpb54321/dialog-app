interface NewableSpeechRecogntion {
  new(): SpeechRecognition
}

export default interface ChromeWindow extends Window {
  webkitSpeechRecognition(): NewableSpeechRecogntion;
}
