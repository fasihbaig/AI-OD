import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChatItem } from '@app/interface/chat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {

  constructor(private http: HttpClient) {}

  postChat(chatItem: ChatItem):Observable<any>{
    return this.http.post("api/chat", chatItem);
  }

}