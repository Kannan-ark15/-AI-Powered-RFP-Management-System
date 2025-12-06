import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable<any>  } from 'rxjs';
import { RFP } from '../models/rfp.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RfpService {
  private apiUrl = `${environment.apiUrl}/rfps`;

  constructor(private http: HttpClient) {}

  create(rfp: RFP): Observable<any>  {
    return this.http.post(this.apiUrl, rfp);
  }

  getAll(): Observable<any>  {
    return this.http.get(this.apiUrl);
  }

  getById(id: string): Observable<any>  {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  update(id: string, rfp: Partial): Observable<any>  {
    return this.http.put(`${this.apiUrl}/${id}`, rfp);
  }

  send(id: string, vendorIds: string[]): Observable<any>  {
    return this.http.post(`${this.apiUrl}/${id}/send`, { vendorIds });
  }
}