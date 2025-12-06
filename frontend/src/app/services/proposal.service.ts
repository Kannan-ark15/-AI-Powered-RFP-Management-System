import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable<any>  } from 'rxjs';
import { Proposal } from '../models/proposal.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProposalService {
  private apiUrl = `${environment.apiUrl}/proposals`;

  constructor(private http: HttpClient) {}

  getByRfp(rfpId: string): Observable<any>  {
    return this.http.post(`${this.apiUrl}/by-rfp`, { rfpId });
  }
}