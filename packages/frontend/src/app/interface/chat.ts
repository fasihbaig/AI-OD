import { ContentType, MessageType } from "@app/enums";


export interface ChatItem {
    id: number | null;
    contentType: ContentType;
    message?: string | Blob | null;
    date: Date;
    messageType: MessageType
    image?: string | null,
    username: string,
    file?: {data: string} //audio file base 64 string
}