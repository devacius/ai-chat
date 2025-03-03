import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext'; // Import PrimeNG input

@Component({
  selector: 'app-input-field',
  standalone: true, // Mark component as standalone
  imports: [CommonModule, FormsModule, InputTextModule], // Import dependencies
  template: `
    <div class="p-fluid">
      <label *ngIf="label" class="block mb-2">{{ label }}</label>
      <input 
        pInputText
        type="text" 
        [(ngModel)]="value" 
        [placeholder]="placeholder"
        (input)="logInput()" 
        class="w-full p-2 border border-gray-300 rounded-md"
      />
    </div>
  `,
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent {
  @Input() label?: string;
  @Input() placeholder: string = 'Enter text';
  value: string = '';

  logInput() {
    console.log('Input Value:', this.value);
  }
}
