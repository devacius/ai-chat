import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './shared/components/button/button.component'; // Import ButtonComponent
import { InputFieldComponent } from './shared/components/Input-field/input-field.component';

@Component({
  selector: 'app-root',
  standalone: true, // Ensure AppComponent is also standalone
  imports: [RouterOutlet, ButtonComponent,InputFieldComponent], // Import ButtonComponent directly
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';
}
