import { ContentType, MessageType } from "@app/enums";


export interface ChatItem {
    id: number | null;
    contentType: ContentType;
    message?: string | null;
    audio?: Blob | string | null;
    date: Date;
    messageType: MessageType
    image?: string | null,
    username: string
}