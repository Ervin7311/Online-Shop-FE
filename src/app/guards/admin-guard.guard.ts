import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserService } from './../services/user.service';
import { catchError, filter, map, Observable, of, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.userService.getCurrentUser().pipe(
      filter(user => user !== null),
      take(1), 
      map(user => {
        if (user.role === 'ADMIN') {
          return true;
        } else {
          this.router.navigate(['/access-denied']);
          return false;
        }
      }),
      catchError(() => {
        this.router.navigate(['/access-denied']);
        return of(false);
      })
    );
  }
}