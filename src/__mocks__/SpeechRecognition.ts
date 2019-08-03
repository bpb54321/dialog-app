import { thisTypeAnnotation } from "@babel/types";

/**
 * Mocks the SpeechRecognition interface of the Web Speech API - currently only available on Chrome
 * @link (https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition)
 */


export function SpeechRecognition(this: SpeechRecognition) {
  this.continuous = false;
  this.interimResults = false;
  this.lang = "";
  this.maxAlternatives = 1;
  this.onaudioend = null;
  this.onaudiostart = null;
  this.onend = null;
  this.onerror = null;
  this.onnomatch = null;
  this.onresult = null;
  this.onsoundend = null;
  this.onsoundstart = null;
  this.onspeechend = null;
  this.onspeechstart = null;
  this.onstart = null;
}

SpeechRecognition.prototype.start = function() {}
SpeechRecognition.prototype.stop = function() {};


