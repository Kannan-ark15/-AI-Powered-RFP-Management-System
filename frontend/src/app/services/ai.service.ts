import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AiService {
  private apiUrl = `${environment.apiUrl}/ai`;

  constructor(private http: HttpClient) {}

  parseRFP(text: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/parse-rfp`, { naturalLanguageText: text });
  }

  parseProposal(emailBody: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/parse-proposal`, { emailBody });
  }

  compare(rfpId: string): Observable<any>{
    return this.http.post(`${this.apiUrl}/compare`, { rfpId });
  }
}