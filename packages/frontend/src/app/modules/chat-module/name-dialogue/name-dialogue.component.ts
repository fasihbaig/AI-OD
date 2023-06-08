import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-name-dialogue',
  templateUrl: './name-dialogue.component.html',
  styleUrls: ['./name-dialogue.component.scss']
})
export class NameDialogueComponent implements OnInit {

  public name = "";

  constructor(
    public dialogRef: MatDialogRef<NameDialogueComponent>,
  ) { }

  ngOnInit(): void {
  }

  saveName() {
    if(this.name) {
      this.dialogRef.close({name: this.name})
    }
  }
}
