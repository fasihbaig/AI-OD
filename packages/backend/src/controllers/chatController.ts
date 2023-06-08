import { AIChatRole, OPEN_AI_PAYLOAD_MODEL, OpenAIService } from "../integrations";

import { Request, Response } from "express";
import { TextToSpeechService } from "../integrations/text-to-speech";
import { convertFileToBase64, determineTextLanguage, } from "../utils";
import { LanguageKey } from "../enums";
 
const CHAT_LIST: any[] = [];

export const chatWithOpenAI = async (req: Request, res: Response ) => {
    const { messageType, contentType, date, username } = req.body;
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

    let transcriptionLanguage = LanguageKey.ENGLISH;
    if(contentType === "audio") {
        console.log("Start transcription audio")
        chatItem.file = req.body.file;
        const audioTranscription = await openAiService.getAudioTranscription(chatItem.file);
        transcriptionLanguage = determineTextLanguage(audioTranscription);
        receivedChatItem.audioTranscription = audioTranscription;
        receivedChatItem.contentType = "text";
        message = audioTranscription;
        console.log(`Transcription Text:${audioTranscription}`);
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

    console.log("get message reply from Open AI");
    openAIResponse = await openAiService.getQueryResponse({
        model: OPEN_AI_PAYLOAD_MODEL,
        messages,
        max_tokens: 250
    });

    if(openAIResponse) {
        console.log(`Reply from open AI:${JSON.stringify(openAIResponse.response, null, 1)}`);
        receivedChatItem.message =`${username} \n ${openAIResponse.response}`;
        if(contentType === "audio") {
            try {
                console.log(`Convert open AI reply to audio`);
                const textToSpeechService = TextToSpeechService.getInstance();
                const speechAudioFilePath = await textToSpeechService.textToSpeech(receivedChatItem.message, transcriptionLanguage);
                const base64File = await convertFileToBase64(speechAudioFilePath);
                receivedChatItem.file = { data: base64File }
                receivedChatItem.contentType = "audio";
            } catch (error) {
                console.log(`Unable to convert text to speech, ${error}`);
            }
        }
    } else {
        receivedChatItem = null;
        console.log(`No reply from open AI for message ${message}`);
    }
    
    receivedChatItem.date = new Date();

    if(receivedChatItem) {
        CHAT_LIST.push(receivedChatItem);
    }

    if(CHAT_LIST.length > 200) { // TEMPORARY CHECK UNTIL WE SAVE MESSAGES IN DB
        CHAT_LIST.slice(0, 20);
    }

    res.json(receivedChatItem)
}