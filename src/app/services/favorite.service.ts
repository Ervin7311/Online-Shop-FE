import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable, Output, signal } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {

  private favoriteSignal = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  loadFavoritesItems() {
    this.getFavoriteItems().subscribe(
      (items) => {
        this.favoriteSignal.set(items);
        localStorage.setItem('favorites', JSON.stringify(items)); 
        localStorage.setItem('lastFetchTimeInFavorite', new Date().toISOString());
      },
      (error) => {
        const storedItems = localStorage.getItem('favorites');
        if (storedItems) {
          this.favoriteSignal.set(JSON.parse(storedItems));
        }
      }
    );
  }
    addToFavorites(product: any) {
    this.favoriteSignal.update(items => [...items, product]);
  }
  
  removeProductFromFavorite(id: number) {
    this.favoriteSignal.update((items) => items.filter(item => item.id !== id));
  }

  getProducts() {
    return this.favoriteSignal(); 
  }

  productIsInFavorites(productId: number) {
    return this.favoriteSignal().some(item => item.product?.id === productId);
  }

  getFavoriteItems(): Observable<any[]> {
    return this.http.get<any[]>(environment.backendUrl + "/favorite");
  }

  addItemToFavorite(productId: number): Observable<any> {
    return this.http.post(environment.backendUrl + "/favorite/add?product_Id=" + productId, {});
  }

  deleteItemFromFavorite(Id: number): Observable<any> {
    return this.http.delete(`${environment.backendUrl}/favorite/${Id}`);
  }
}
