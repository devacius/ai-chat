import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button'; // Import PrimeNG ButtonModule

@Component({
  selector: 'app-button',
  standalone: true, // Mark component as standalone
  imports: [CommonModule, ButtonModule], // Import dependencies
  templateUrl: './button.component.html',

  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() label: string = 'Click Me';
  @Input() icon?: string;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() severity: 'primary' | 'secondary' | 'success' | 'danger' = 'primary';
  @Output() onClick = new EventEmitter<void>();
  handleClick() {
    console.log("button clicked")
    this.onClick.emit();
  }
}
