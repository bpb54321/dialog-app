import React, {ChangeEvent, FormEvent, useEffect, useState} from 'react';
import "../css/LineGuess.css";
import SpeechInputButton from "./SpeechInputButton";
import {SpeechRecognitionState} from "../types/SpeechRecognitionState";
import Role from "../types/Role";

interface Props {
    addLineGuessToLastLine: (lineGuess: string) => void;
    chosenRole: Role;
    dialogLanguageCode: string;
}

export const LineGuess: React.FunctionComponent<Props> = (props) => {
  debugger;
  const [guess, setGuess] = useState("");
  const [speechRecognitionState, setSpeechRecognitionState] = useState(SpeechRecognitionState.Stopped);
  const [speechRecognition, setSpeechRecognition] = useState(null as (SpeechRecognition | null));

  debugger;

  const handleSpeechRecognitionResult = (event: any) => {
    debugger;
    let results: SpeechRecognitionResultList = event.results;

    let resultPhrase = "";
    for (let i = 0; i < results.length; i++) {
      resultPhrase += results[i][0].transcript;
    }

    setGuess(resultPhrase);
  };

  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    debugger;
    setGuess(event.target.value);
  };

  const handleSubmit = (event: FormEvent) => {
    debugger;
    event.preventDefault();

    if(speechRecognition) {
      speechRecognition.stop();
    }

    props.addLineGuessToLastLine(guess);

    setGuess("");
    setSpeechRecognitionState(SpeechRecognitionState.Stopped);
  };

  const updateSpeechRecognitionState = () => {
    debugger;
    if (speechRecognition) {
      if (speechRecognitionState === SpeechRecognitionState.Stopped) {
        speechRecognition.start();
        setSpeechRecognitionState(SpeechRecognitionState.Started);
      } else {
        speechRecognition.stop();
        setSpeechRecognitionState(SpeechRecognitionState.Stopped);
      }
    }
  };

  useEffect(() => {
    debugger;
    if((window as any).webkitSpeechRecognition) {
      const newSpeechRecognition: SpeechRecognition = new (window as any).webkitSpeechRecognition();
      newSpeechRecognition.onresult = handleSpeechRecognitionResult;
      newSpeechRecognition.interimResults = true;
      newSpeechRecognition.maxAlternatives = 1;
      newSpeechRecognition.continuous = true;
      newSpeechRecognition.lang = props.dialogLanguageCode;
      setSpeechRecognition(newSpeechRecognition);
    }
  }, [props.dialogLanguageCode]);

  debugger;

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
      {speechRecognition ?
        <SpeechInputButton
          updateSpeechRecognitionState={updateSpeechRecognitionState}
          speechRecognitionState={speechRecognitionState}
        /> :
        null
      }
      <input type="submit" data-testid={"line-guess__submit"} value={"Submit Guess"}/>
    </form>
  );
};
