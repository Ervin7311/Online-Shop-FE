import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  user = {
    fullname: '',
    username: '',
    email: '',
    password: '',
    phone: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  register(form: any): void {

  
    if (form.invalid) {
      Object.values(form.controls).forEach((control: any) => control.markAsTouched());
      return;
    }

    
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{6,}$/;

    if (!emailRegex.test(this.user.email)) {
      alert('Email must be a valid Gmail address (example@gmail.com).');
      return;
    }

    if (!passwordRegex.test(this.user.password)) {
      alert('Password must include letters, numbers, and special characters.');
      return;
    }

  
    const userPayload = {
      fullName: this.user.fullname,
      username: this.user.username,
      email: this.user.email,
      password: this.user.password,
      phoneNumber: this.user.phone
    };

  
    this.authService.register(userPayload).subscribe({
      next: () => {
      
        this.authService.login(this.user.username, this.user.password).subscribe({
          next: () => {
            console.log('Login successful');
            console.log('Token nga getToken():', this.authService.getToken());
            console.log('Token nga localStorage:', localStorage.getItem('auth_token'));
            this.router.navigate(['/shop']);
          },
          error: () => alert('Login failed, please login manually.')
        });
      },
      error: () => alert('Registration failed, please try again.')
    });
  }
}
