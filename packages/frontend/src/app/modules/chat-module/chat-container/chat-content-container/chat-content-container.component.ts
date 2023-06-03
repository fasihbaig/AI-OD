import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat-content-container',
  templateUrl: './chat-content-container.component.html',
  styleUrls: ['./chat-content-container.component.scss']
})
export class ChatContentContainerComponent implements OnInit {

  @Input() chatList: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

}
