import { SpeechSynthesizer, SpeechConfig, AudioConfig, ResultReason } from "microsoft-cognitiveservices-speech-sdk";

import readline from "readline";
import { PERSON_VOICE } from "./constants";
import { LanguageKey, SpeechNarrators } from "../../enums";

export class TextToSpeechService {

    private static instance: TextToSpeechService | null = null;

    private constructor() {}

    public static getInstance(): TextToSpeechService {
        if(TextToSpeechService.instance) {
            return TextToSpeechService.instance;
        }
        return new TextToSpeechService();
    }

    /**
     * 
     * @param speechText 
     * @returns 
     */
    public textToSpeech(speechText: string, language: LanguageKey): Promise<string> {
        return new Promise((resolve, reject) => {
            const audioFile = `/tmp/audio${new Date().getTime()}.webm`;
            const speechConfig = SpeechConfig.fromSubscription(
                process.env.AZURE_SPEECH_COGNITIVE_API_KEY as string,
                process.env.AZURE_REGION as string
                );
            const audioConfig = AudioConfig.fromAudioFileOutput(audioFile);

            // The language of the voice that speaks.
            speechConfig.speechSynthesisVoiceName = this.getPersonVoice(language); 
                
            // Create the speech synthesizer.
            var synthesizer: SpeechSynthesizer = new SpeechSynthesizer(speechConfig, audioConfig);

            if(!synthesizer) {
                return null
            }

            synthesizer.speakSsmlAsync(
                this.getSpeechTextTemplate(speechText, language),
                    function (result) {
                      if (result.reason === ResultReason.SynthesizingAudioCompleted) {
                        console.log("synthesis finished.");
                      } else {
                        console.error("Speech synthesis canceled, " + result.errorDetails +
                            "\nDid you set the speech resource key and region values?");
                        reject("Unable to create audio stream");
                      }
                      synthesizer.close();
                      resolve(audioFile);
                    },
                    function (err) {
                    console.trace("err - " + err);
                    synthesizer.close();
                    reject(err)
                });
                console.log("Now synthesizing to: " + audioFile);
            });
    }

    /**
     * 
     * @param language 
     * @returns 
     */
    getPersonVoice(language: LanguageKey): SpeechNarrators {
        if(language === LanguageKey.ENGLISH) {
            return SpeechNarrators.JENNY;
        }
        if( language === LanguageKey.URDU) {
            return SpeechNarrators.UZMA;
        }
        return SpeechNarrators.UZMA;
    }

    getSpeechTextTemplate(text: string, language: LanguageKey): string {
        return `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis"
                        xmlns:mstts="https://www.w3.org/2001/mstts" xml:lang="${language}">
                    <voice name="${this.getPersonVoice(language)}">
                        <mstts:express-as style="friendly" styledegree="2">
                            ${text}
                        </mstts:express-as>
                    </voice>
                </speak>`;
    }
}