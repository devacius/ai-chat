import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext'; // PrimeNG input module

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [CommonModule, FormsModule, InputTextModule], // Import necessary modules
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {
  @Input() label?: string;
  @Input() placeholder: string = 'Enter text';
  @Output() inputValueChange = new EventEmitter<string>(); // Emit input value to parent
  value: string = '';

  // Emit the current input value when the button is clicked in the parent
  sendValue() {
    this.inputValueChange.emit(this.value);
  }
  
}
