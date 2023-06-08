export const OPEN_AI_CHAT_API = "https://api.openai.com/v1/chat/completions";

export const OPEN_AI_AUDIO_TRANSCRIPTION_URL = "https://api.openai.com/v1/audio/transcriptions";

export enum AIChatRole {
    USER = "user",
    SYSTEM = "system",
    ASSISTANT = "assistant"
}

export const OPEN_AI_PAYLOAD_MODEL = "gpt-3.5-turbo";

export const AUDIO_TRANSCRIPTION_MODEL = "whisper-1";

export const API_TIMEOUT = 1000 * 60 * 5;