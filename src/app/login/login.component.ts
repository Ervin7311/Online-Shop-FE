import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private http: HttpClient, private router: Router) { }

  login() {
    const loginData = {
    username: this.username,
      password: this.password
    };

this.http.post<any>('http://localhost:8080/api/auth/login', loginData)
  .subscribe({
    next: (res) => {
      console.log('Login response:', res);
      const token = res.token || res.jwt || '';
      console.log('Extracted token:', res);
      const userId = res.id || '';
      if (token) {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('userId', userId);
        this.router.navigate(['/shop']).then(() => {
          window.location.reload(); 
        });
      } else {
        this.errorMessage = 'Token not found in response.';
      }
    },
    error: (err) => {
      this.errorMessage = 'Login failed: ' + (err.error?.message || 'Check your credentials');
    }
  });
  }
}
