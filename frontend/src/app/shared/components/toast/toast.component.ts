import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-toast',
  standalone: true,
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  imports:[CommonModule]
})
export class ToastComponent {
  @Input() message: string = '';
  @Input() type: 'success' | 'error' = 'success';
  @Input() show: boolean = false;
}
