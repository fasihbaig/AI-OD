import { AIChatRole, OPEN_AI_PAYLOAD_MODEL, OpenAIService } from "../integrations";

import { Request, Response } from "express";
 
const CHAT_LIST = [];

export const chatWithOpenAI = async (req: Request, res: Response ) => {
    const { message, messageType, contentType, date } = req.body as never;

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
        id: Math.floor(Math.random() * 10000000)
    }
    CHAT_LIST.push(chatItem);
    const openAiService  = OpenAIService.getInstance();
    const chatResponse = await openAiService.getQueryResponse({
        model: OPEN_AI_PAYLOAD_MODEL,
        messages: [{ role: AIChatRole.USER, content: message }]
    });

    const responseChatItem = chatResponse?{ 
        message: chatResponse.choices[0].message.content,
        messageType: "received", 
        contentType: "text", 
        date: new Date(), 
        replyId: chatItem.id,
        id:  Math.floor(Math.random() * 10000000)
    }: null;
    if(responseChatItem) {
        CHAT_LIST.push(responseChatItem);
    }

    res.json(responseChatItem)
}