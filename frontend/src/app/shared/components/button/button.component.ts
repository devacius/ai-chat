import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Import PrimeNG ButtonModule

@Component({
  selector: 'app-button',
  standalone: true, // Mark component as standalone
  imports: [CommonModule, ButtonModule], // Import dependencies
  template: `
    <p-button 
      [label]="label" 
      [icon]="icon" 
      [severity]="severity" 
      [type]="type">
    </p-button>
  `,
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string = 'Click Me';
  @Input() icon?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() severity: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';
}
