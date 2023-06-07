import  axios from "axios";

import { AUDIO_TRANSCRIPTION_MODEL, OPEN_AI_AUDIO_TRANSCRIPTION_URL, OPEN_AI_CHAT_API } from "./constants";
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
     * @param openAiPayload 
     * @returns 
     */
    public async getQueryResponse(openAiPayload: OpenAIPayload ): Promise<OpenAIChatResponse | null> {
        try {
            const response = await axios.post(OPEN_AI_CHAT_API, openAiPayload, { headers: this.getOpenAIHeaderValues() });
            return response.data; 
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
                    }
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