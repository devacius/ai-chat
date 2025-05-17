import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonComponent } from './shared/components/button/button.component'; // Import ButtonComponent
import { InputFieldComponent } from './shared/components/Input-field/input-field.component';
import { UserService } from './user-service.service';
import { HttpClientModule } from '@angular/common/http';
import { ChatResponseDisplayComponent } from './shared/components/chat-response-display/chat-response-display.component';

@Component({
  selector: 'app-root',
  standalone: true, // Ensure AppComponent is also standalone
  imports: [RouterOutlet, ButtonComponent,InputFieldComponent,HttpClientModule,ChatResponseDisplayComponent], // Import ButtonComponent directly
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent {
  title = 'frontend';
  inputText: string = '';
  finalLLMInput: string = '';
  chatResponse: string = '';
  constructor(private apiService: UserService) { }
  handleInputChange(value: string) {
    console.log('Input Value in hanlde:', value); // Log input value when it changes
    this.inputText = value; // Store input value
  }

  logInputValue() {
    console.log('final after click')
    console.log('Input Value:', this.inputText);
    this.finalLLMInput=this.inputText;
    this.makeApiCall(); // Log value when button is clicked
  }
  makeApiCall() {
    if (this.finalLLMInput) {
      this.apiService.postWithQueryParams({}, {"query":this.finalLLMInput }).subscribe({
        next: (response: any) => {
          console.log('Response received:', response);
          this.chatResponse = response.response || 'No response from server';
          // Handle your response here
        },
        error: (error) => {
          console.error('Error occurred:', error);
          // Handle your error here
        }
      });
    } else {
      console.error('finalLLMInput is undefined');
    }
  }
}
