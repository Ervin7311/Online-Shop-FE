// order.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  items: OrderItem[];
}

export interface OrderItem {
  productId: number;
  quantity: number;
  productName: string | null;
  price: number;
}

export interface OrderWithItemsDto {
  orderId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getOrders(): Observable<OrderWithItemsDto[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<OrderWithItemsDto[]>(`${this.apiUrl}/by/user`, { headers });
  }

  getAllOrders(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<Order[]>(this.apiUrl, { headers });
  }
  downloadReport(url: string) {
    return this.http.get(url, {
      responseType: 'blob'
    });
  }
}
