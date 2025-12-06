import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Vendor } from '../models/vendor.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VendorService {
  private apiUrl = `${environment.apiUrl}/vendors`;

  constructor(private http: HttpClient) {}

  create(vendor: Vendor): Observable<any>  {
    return this.http.post(this.apiUrl, vendor);
  }

  getAll(): Observable<any>  {
    return this.http.get(this.apiUrl);
  }

  update(id: string, vendor: Partial<any>): Observable<any>  {
    return this.http.put(`${this.apiUrl}/${id}`, vendor);
  }
}