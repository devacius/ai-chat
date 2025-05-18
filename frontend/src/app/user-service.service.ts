import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  chatResponse='';
  private readonly BACKEND_URL= environment.apiBaseUrl;
  private readonly apiUrl = `${this.BACKEND_URL}/extract-query`; // Replace with your actual API URL
  private readonly chatApiUrl = `${this.BACKEND_URL}/chat`;

  constructor(private readonly http: HttpClient) { }


  /**
   * Call /chat endpoint to get response from PDF-based chatbot
   * @param fileId - Filename uploaded in the backend (used as identifier)
   * @param message - User's question
   */
  chatWithPDF(fileId: string, message: string): Observable<{ response: string }> {
    const body = {
      file_id: fileId,
      message: message
    };

    return this.http.post<{ response: string }>(this.chatApiUrl, body);
  }
  // Method for making POST request with query parameters
  postWithQueryParams(queryParams: any, bodyData: any): Observable<any> {
    // Create HttpParams object
    let params = new HttpParams();
    
    // Add all query parameters
    Object.keys(queryParams).forEach(key => {
      params = params.append(key, queryParams[key]);
    });

    // Return the POST request observable
    return this.http.post(this.apiUrl, bodyData, { params });
  }

}
                      