import { NgFor, NgIf } from '@angular/common';
import { User } from '../../../interface/user';
import { UserService } from './../../Service/user.service';
import { Component, OnInit } from '@angular/core';
import { format } from 'path';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-managment',
  imports: [ NgFor, NgIf, FormsModule],
  templateUrl: './user-managment.component.html',
  styleUrl: './user-managment.component.css'
})
export class UserManagmentComponent implements OnInit {

  users: User[] = [];
  editingUser: User | null = null;

  roles: string[] = ['ADMIN', 'USER'];
  statuses: string[] = ['ACTIVE', 'INACTIVE'];

  searchName: string = '';
  selectedRole: string = '';
  selectedStatus: string = '';

allUsers: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }


  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.users = [...data];
      },
      error: (err) => {
        console.error('Gabim gjatë ngarkimit të përdoruesve:', err);
      }
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUserById(userId).subscribe({
      next: () => {
        this.users = this.users.filter(user => user.id !== userId);
      }
    });
  }

  startEdit(user: User): void {
    this.editingUser = { ...user };
  }

  cancelEdit(): void {
    this.editingUser = null;
  }

  updateUser(): void {
    if (!this.editingUser || !this.editingUser.id) return;

    this.userService.updateUser(this.editingUser.id, this.editingUser).subscribe({
      next: (updatedUser) => {
        const index = this.users.findIndex(u => u.id === updatedUser.id);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        this.editingUser = null;
        this.loadUsers();
      },
      error: (err) => {
        console.error('Gabim gjatë përditësimit të përdoruesit:', err);
      }
    });
  }
  
  applyFilters(): void {
  this.userService.searchUsers(this.searchName, this.selectedRole, this.selectedStatus)
    .subscribe({
      next: users => {
        this.users = users;
      },
      error: err => {
        console.error('Gabim gjatë filtrimit:', err);
      }
    });
}


}
