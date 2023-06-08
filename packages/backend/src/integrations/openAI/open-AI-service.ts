import  axios from "axios";

import { API_TIMEOUT, AUDIO_TRANSCRIPTION_MODEL, CUSTOMIZED_AI_MODEL_SERVER, OPEN_AI_AUDIO_TRANSCRIPTION_URL, OPEN_AI_CHAT_API } from "./constants";
import { OpenAIChatResponse, OpenAIPayload } from "./types";
import FormData  from "form-data";

import { get } from "lodash";

import  fs from "fs";

export class OpenAIService {

    private static instance: OpenAIService | null = null;

    private constructor() {}

    public static getInstance(): OpenAIService {
        if(OpenAIService.instance) {
            return OpenAIService.instance;
        }
        return new OpenAIService();
    }

    /**
     * 
     * @param payload 
     * @returns 
     */
    public async getQueryResponse(payload: any): Promise<any | null> {
        try {
            const response = await axios.post(CUSTOMIZED_AI_MODEL_SERVER, payload, { timeout: API_TIMEOUT });
            return response.data.response; 
            // const response = await axios.post(
            //     OPEN_AI_CHAT_API, 
            //     openAiPayload, 
            //     { 
            //         headers: this.getOpenAIHeaderValues(),
            //         timeout: API_TIMEOUT
            //     });
            // return response.data; 
        } catch (error) {
            console.log(error);
            const message = get(error, "response.data.error.message") || "No information found";
            throw Error(message)
        }
    }

    private getOpenAIHeaderValues(): {[index: string]: string} {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPEN_AI_KEY}`
        }
    }

    public async getAudioTranscription(audio: any): Promise<any> {
        try {
            const formData = new FormData();
            const filePath = await this.createTempFile(audio.data.split(",")[1]);
            formData.append('file', fs.createReadStream(filePath));
            formData.append('model', AUDIO_TRANSCRIPTION_MODEL);
            const response = await axios.post(
                OPEN_AI_AUDIO_TRANSCRIPTION_URL, 
                formData, { 
                    headers: {
                        ...this.getOpenAIHeaderValues(), 
                        ...formData.getHeaders()
                    },
                    timeout: API_TIMEOUT
                }
            );
            return response.data.text; 
        } catch (error) {
            return null;
        }
    }

    // Function to create a temporary file from the base64 data
    public async createTempFile(base64Data: string): Promise<string> {
        try {
            const tempFilePath = `/tmp/audio_temp_file${new Date().getTime()}.webm`; // Path to the temporary file
        
            const fileBuffer = Buffer.from(base64Data, 'base64');
            await fs.writeFileSync(tempFilePath, fileBuffer);
        
            return tempFilePath;
          } catch (error) {
            throw new Error(`Error creating temporary file: ${error}`);
          }
    };
}