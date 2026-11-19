import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl = 'http://localhost:8080/api/users';

  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadCurrentUser(): void {
    this.http.get(`${this.baseUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(error => {
        console.error('Error loading current user:', error);
        this.currentUserSubject.next(null);
        return of(null); 
      })
    ).subscribe();
  }

    getCurrentUser(): Observable<any> {
    return this.currentUser$;
  }

  getUserById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateUser(id: number, updateData: any): Observable<any> {
  return this.http.put<any>(`${this.baseUrl}/${id}`, updateData, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
  });
  }
}
