import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import "./LineGuess.css";
import SpeechInputButton from "./SpeechInputButton";
import {SpeechRecognitionState} from "./types/SpeechRecognitionState";
import {useGlobalState} from "./contexts/GlobalStateContext";
import Role from "./types/Role";

interface Props {
    addLineGuessToLastLine: (lineGuess: string) => void;
    chosenRole: Role;
}

export const LineGuess: React.FunctionComponent<Props> = (props) => {
  const [guess, setGuess] = useState("");
  const [speechRecognitionState, setSpeechRecognitionState] = useState(SpeechRecognitionState.Stopped);

  const globalState = useGlobalState();

  const handleSpeechRecognitionResult = (event: any) => {
    let results: SpeechRecognitionResultList = event.results;

    let resultPhrase = "";
    for (let i = 0; i < results.length; i++) {
      resultPhrase += results[i][0].transcript;
    }

    setGuess(resultPhrase);
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setGuess(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    globalState.speechRecognition.stop();

    props.addLineGuessToLastLine(guess);

    setGuess("");
    setSpeechRecognitionState(SpeechRecognitionState.Stopped);
  };

  const updateSpeechRecognitionState = () => {
    if (speechRecognitionState === SpeechRecognitionState.Stopped) {
      globalState.speechRecognition.start();
      setSpeechRecognitionState(SpeechRecognitionState.Started);
    } else {
      globalState.speechRecognition.stop();

      setSpeechRecognitionState(SpeechRecognitionState.Stopped);
    }
  };

  useEffect(() => {
    globalState.speechRecognition.onresult = handleSpeechRecognitionResult;
  }, [globalState.speechRecognition]);

  return (
    <form
      data-testid={"line-guess"}
      onSubmit={handleSubmit}
    >
      <label htmlFor="line-guess__text-input" data-testid={"line-guess__label"}>Line Guess</label>
      <textarea
        className={"line-guess__text-input"}
        data-testid={"line-guess__text-input"}
        id={"line-guess__text-input"}
        onChange={handleInputChange}
        placeholder={`Text of the next line for ${props.chosenRole.name}`}
        value={guess}
      />
      <SpeechInputButton
        updateSpeechRecognitionState={updateSpeechRecognitionState}
        speechRecognitionState={speechRecognitionState}
      />
      <input type="submit" data-testid={"line-guess__submit"} value={"Submit Guess"}/>
    </form>
  );
};
