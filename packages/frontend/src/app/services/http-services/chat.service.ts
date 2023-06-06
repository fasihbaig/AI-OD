import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatItem } from '@app/interface/chat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private http: HttpClient) {}

  postChat(chatItem: ChatItem & {file?: any}, file?: any):Observable<any>{
    if(file) {
      delete chatItem.message;
      chatItem.file = file;
    }
    return this.http.post("api/chat", chatItem);
  }

}