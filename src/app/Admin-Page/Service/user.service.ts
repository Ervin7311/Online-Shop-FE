import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../../interface/user';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly apiUrl = `${environment.backendUrl}/users`;

  constructor(private http: HttpClient) {}


  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }
  
    searchUsers(name?: string, role?: string, status?: string): Observable<User[]> {
    let params = new HttpParams();
    if (name) params = params.set('name', name);
    if (role) params = params.set('role', role);
    if (status) params = params.set('status', status);

    return this.http.get<User[]>(`${this.apiUrl}/search`, { params });
  }

  deleteUserById(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }
  updateUser(id: number, user: User): Observable<User> {
  return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }
}
