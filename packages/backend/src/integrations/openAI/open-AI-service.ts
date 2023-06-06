import  axios from "axios";

import { OPEN_AI_CHAT_API } from "./constants";
import { OpenAIChatResponse, OpenAIPayload } from "./types";

export class OpenAIService {

    private static instance: OpenAIService | null = null;

    private constructor() {

    }

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
            return null;
        }
      
    }

    private getOpenAIHeaderValues(): {[index: string]: string} {
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.OPEN_AI_KEY}`
        }
    }
}