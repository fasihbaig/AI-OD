import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-option-bar',
  templateUrl: './option-bar.component.html',
  styleUrls: ['./option-bar.component.scss']
})
export class OptionBarComponent implements OnInit {
  @Output() onClearChat: EventEmitter<void> = new EventEmitter<void>(); 

  constructor() { }

  ngOnInit(): void {
  }

  clearChat() {
      this.onClearChat.emit();
  }

}
