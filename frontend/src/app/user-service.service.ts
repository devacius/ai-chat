import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://127.0.0.1:8000/extract-query'; // Replace with your actual API URL

  constructor(private http: HttpClient) { }

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
                      