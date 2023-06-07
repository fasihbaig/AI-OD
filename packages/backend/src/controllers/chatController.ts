import { AIChatRole, OPEN_AI_PAYLOAD_MODEL, OpenAIService } from "../integrations";

import { Request, Response } from "express";
import { TextToSpeechService } from "../integrations/text-to-speech";
import { convertFileToBase64 } from "../utils";
 
const CHAT_LIST: any[] = [];

export const chatWithOpenAI = async (req: Request, res: Response ) => {
    const { messageType, contentType, date } = req.body;
    let { message } = req.body;
    const { session } = req.headers;

    const chatItem = { 
        message,
        messageType, 
        contentType, 
        date, 
        id: Math.floor(Math.random() * 10000000),
        sessionId: session,
        file: null
    }
    const openAiService  = OpenAIService.getInstance();
    const messages = [];

    let openAIResponse = null;

    let receivedChatItem: any = { 
        message: "",
        messageType: "received", 
        contentType: contentType, 
        date: new Date(), 
        replyId: chatItem.id,
        id:  Math.floor(Math.random() * 10000000),
        sessionId: session,
        audioTranscription: ""
    };

    if(contentType === "audio") {
        chatItem.file = req.body.file;
        const audioTranscription = await openAiService.getAudioTranscription(chatItem.file);
        receivedChatItem.audioTranscription = audioTranscription;
        receivedChatItem.contentType = "text";
        message = audioTranscription;
    }    

    // last 5 messages by sessionId
    for(let index = CHAT_LIST.length -1; index >= 0; index -= 1) {
        const messageItem = CHAT_LIST[index];

        if(
        messageItem.contentType === "text" 
        && messageItem.messageType === "sent"
        && messageItem.sessionId === session ) {
            messages.unshift({ role: AIChatRole.USER, content: messageItem.message})
        }
    }

    CHAT_LIST.push(chatItem);
    messages.push({ role: AIChatRole.USER, content: message });

    openAIResponse = await openAiService.getQueryResponse({
        model: OPEN_AI_PAYLOAD_MODEL,
        messages
    });

    if(openAIResponse) {
        receivedChatItem.message = openAIResponse.choices[0].message.content;
        if(contentType === "audio") {
            try {
                const textToSpeechService = TextToSpeechService.getInstance();
                const speechAudioFilePath = await textToSpeechService.textToSpeech(receivedChatItem.message);
                const base64File = await convertFileToBase64(speechAudioFilePath);
                receivedChatItem.file = { data: base64File }
                receivedChatItem.contentType = "audio";
            } catch (error) {
                console.log(`Unable to convert text to speech, ${error}`);
            }
        }
    } else {
        receivedChatItem = null;
    }
    
    receivedChatItem.date = new Date();

    if(receivedChatItem) {
        CHAT_LIST.push(receivedChatItem);
    }

    res.json(receivedChatItem)
}