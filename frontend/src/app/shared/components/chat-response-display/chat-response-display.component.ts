import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-chat-response-display',
  standalone:true,
  imports:[NgIf],
  templateUrl: './chat-response-display.component.html',
  styleUrls: ['./chat-response-display.component.css']
})
export class ChatResponseDisplayComponent {
  @Input() responseText: string = '';  // This input will receive the response to display
}
