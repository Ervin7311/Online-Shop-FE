import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';


export interface PurchaseHistory {
  id?: number;
  productId: number;
  quantity: number;
  totalPrice: number;
  purchaseDate: string; 
  notes: string;
}

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = 'http://localhost:8080/api/purchase-history';

  constructor(private http: HttpClient) {}


  getPurchase(): Observable<PurchaseHistory[]> {
    return this.http.get<PurchaseHistory[]>(environment.backendUrl + '/purchase');
  }

  createPurchase(productId: number): Observable<PurchaseHistory> {
    return this.http.post<PurchaseHistory>(environment.backendUrl + '/purchase/add', productId);
  }
}
