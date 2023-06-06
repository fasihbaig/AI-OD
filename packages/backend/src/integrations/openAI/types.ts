import { AIChatRole } from "./constants";

export type OpenAIPayload = {
    model: string,
    messages: PayloadMessage[]
}

export type PayloadMessage = {
    role: AIChatRole;
    content: string;
}

export type OpenAIChatResponse = {
    id: string,
    choices: OpenAIResponseChoice[],
    usage: {
        prompt_tokens: number,
        completion_tokens: number,
        total_tokens: number
    }
}

export type OpenAIResponseChoice = {
    index: number,
    message: {
        role: AIChatRole,
        content: string,
    }
}
