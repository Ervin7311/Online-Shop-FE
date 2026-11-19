import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'] 
})
export class ProfileComponent implements OnInit {
  user: any = null;
  editMode = false;
  editForm!: FormGroup;

  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.editForm = this.fb.group({
      fullName: [''],
      username: [''],
      email: [''],
      phoneNumber: ['']
    });

    this.loadUserData();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadUserData();
      });
  }

  loadUserData(): void {
    this.userService.getCurrentUser().subscribe(data => {
      this.user = data;
      this.editForm.patchValue({
        fullName: data.fullName,
        username: data.username,
        email: data.email,
        phoneNumber: data.phoneNumber
      });
    });
  }

  enableEdit(): void {
    this.editMode = true;
  }

  saveChanges(): void {
    if (this.editForm.valid) {
      const updateData = {
        fullName: this.editForm.value.fullName,
        username: this.editForm.value.username,
        email: this.editForm.value.email,
        phoneNumber: this.editForm.value.phoneNumber
      };

      this.userService.updateUser(this.user.id, updateData).subscribe(updatedUser => {
        this.user = updatedUser;
        this.editForm.patchValue(updatedUser);
        this.editMode = false;
      });
    }
  }

  cancelEdit(): void {
    this.editMode = false;
    if (this.user) {
      this.editForm.patchValue({
        fullName: this.user.fullName,
        username: this.user.username,
        email: this.user.email,
        phoneNumber: this.user.phoneNumber
      });
    }
  }
}
