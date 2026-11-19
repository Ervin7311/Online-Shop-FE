import { Product } from '../interface/product';
import { HttpClient } from '@angular/common/http';
import {Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CardItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root' 
})
export class CardService {
  
  private cardSignal = signal<any[]>([]);

  constructor(private http: HttpClient) {
   }
  
  loadCartItems() {
    this.getCartItems().subscribe(
      (items) => {
        this.cardSignal.set(items);
        localStorage.setItem('cart', JSON.stringify(items));
        localStorage.setItem('lastFetchTimeInCard', new Date().toISOString());
      },
      (error) => {
        const storedItems = localStorage.getItem('cart');
        if (storedItems) {
          this.cardSignal.set(JSON.parse(storedItems));
        }
      }
    );
  }

  removeProductFromCardSignal(id: number) {
    this.cardSignal.update((items) => items.filter(item => item.id !== id));
  }

  getProducts(): any[] {
    return this.cardSignal();
  }

  productIsInCart(productId: number) {
    return this.cardSignal().find(item => item.product?.id === productId);
  }
  
  getCartItems(): Observable<any[]> { 
    return this.http.get<any[]>(environment.backendUrl + "/card");
  }

  addItemToCart(productId: number): Observable<any> {
    return this.http.post(environment.backendUrl + "/card/add?product_Id=" + productId +'&quantity=1','');
  }

  deleteItemFromCart(productId: number): Observable<any> {
    return this.http.delete(`${environment.backendUrl}/card/${productId}`);
  }
  updateQuantity(cartId: number, quantity: number) {
  return this.http.put(`http://localhost:8080/api/card/${cartId}/quantity`, null, {
    params: { quantity }
  });
  }
}
