import { AIChatRole, OPEN_AI_PAYLOAD_MODEL, OpenAIService } from "../integrations";

import { Request, Response } from "express";
 
const CHAT_LIST: any[] = [];

export const chatWithOpenAI = async (req: Request, res: Response ) => {
    const { message, messageType, contentType, date } = req.body as never;
    const { session } = req.headers;
    /*
        id: number | null;
        contentType: ContentType;
        message?: string | null;
        audio?: Blob | string | null;
        date: Date;
     */
    const chatItem = { 
        message,
        messageType, 
        contentType, 
        date, 
        id: Math.floor(Math.random() * 10000000),
        sessionId: session,
    }
    const openAiService  = OpenAIService.getInstance();

    const messages = []
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

    const chatResponse = await openAiService.getQueryResponse({
        model: OPEN_AI_PAYLOAD_MODEL,
        messages
    });

    const responseChatItem = chatResponse?{ 
        message: chatResponse.choices[0].message.content,
        messageType: "received", 
        contentType: "text", 
        date: new Date(), 
        replyId: chatItem.id,
        id:  Math.floor(Math.random() * 10000000),
        sessionId: session
    }: null;
    if(responseChatItem) {
        CHAT_LIST.push(responseChatItem);
    }

    res.json(responseChatItem)
}