import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardDateRange {
  startDate: string;
  endDate: string;
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly baseUrl = `${environment.backendUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  getSummary(range: DashboardDateRange): Observable<unknown> {
    return this.get('summary', range);
  }

  getSales(range: DashboardDateRange): Observable<unknown> {
    return this.get('sales', range);
  }

  getOrders(range: DashboardDateRange): Observable<unknown> {
    return this.get('orders', range);
  }

  getUsers(range: DashboardDateRange): Observable<unknown> {
    return this.get('users', range);
  }

  getProductStock(range: DashboardDateRange): Observable<unknown> {
    return this.get('products/stock', range);
  }

  getTopFavoriteProducts(range: DashboardDateRange): Observable<unknown> {
    return this.get('products/top-favorites', range);
  }

  getUserRoles(range: DashboardDateRange): Observable<unknown> {
    return this.get('users/roles', range);
  }

  private get(path: string, range: DashboardDateRange): Observable<unknown> {
    const params = new HttpParams()
      .set('startDate', range.startDate)
      .set('endDate', range.endDate);
    return this.http.get<unknown>(`${this.baseUrl}/${path}`, { params });
  }
}
