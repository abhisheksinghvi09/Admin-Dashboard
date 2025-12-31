import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-users',
  template: `
    <app-nav></app-nav>
    <div class="container">
      <div class="header">
        <h2>User Management</h2>
        <button class="btn-add" (click)="openModal()">+ Add User</button>
      </div>

      <p *ngIf="error" class="error">{{ error }}</p>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of users">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td><span class="badge" [class]="user.role">{{ user.role }}</span></td>
              <td><span class="badge" [class]="user.status">{{ user.status }}</span></td>
              <td>
                <ng-container *ngIf="canModify(user)">
                  <button class="btn-edit" (click)="editUser(user)">Edit</button>
                  <button class="btn-delete" (click)="deleteUser(user._id)">Delete</button>
                </ng-container>
                <span *ngIf="!canModify(user)" class="no-action">-</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="modal-overlay" *ngIf="showModal" (click)="closeModal()">
        <div class="modal" (click)="$event.stopPropagation()">
          <h3>{{ isEditing ? 'Edit User' : 'Add User' }}</h3>
          <form (ngSubmit)="saveUser()">
            <input type="text" [(ngModel)]="form.name" name="name" placeholder="Name" required>
            <input type="email" [(ngModel)]="form.email" name="email" placeholder="Email" required>
            <input *ngIf="!isEditing" type="password" [(ngModel)]="form.password" name="password" placeholder="Password" required>
            <select [(ngModel)]="form.role" name="role">
              <option value="user">User</option>
              <option *ngIf="currentUserRole === 'superadmin'" value="admin">Admin</option>
            </select>
            <select [(ngModel)]="form.status" name="status">
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <p *ngIf="modalError" class="modal-error">{{ modalError }}</p>
            <div class="modal-actions">
              <button type="button" class="btn-cancel" (click)="closeModal()">Cancel</button>
              <button type="submit" class="btn-save">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 32px; max-width: 1200px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    h2 { color: #333; }
    .error, .modal-error { color: #e74c3c; font-size: 14px; margin-bottom: 16px; }
    .modal-error { text-align: center; }
    .btn-add {
      background: #667eea;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 500;
    }
    .table-container {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 16px; text-align: left; border-bottom: 1px solid #eee; }
    th { background: #f8f9fa; font-weight: 600; color: #555; }
    .badge {
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
    }
    .badge.superadmin { background: #fef3c7; color: #92400e; }
    .badge.admin { background: #f3e8ff; color: #7c3aed; }
    .badge.user { background: #e8f0fe; color: #1a73e8; }
    .badge.active { background: #e6f4ea; color: #1e7e34; }
    .badge.inactive { background: #fce8e8; color: #c0392b; }
    .btn-edit, .btn-delete {
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      margin-right: 8px;
      font-size: 12px;
    }
    .btn-edit { background: #e8f0fe; color: #1a73e8; }
    .btn-delete { background: #fce8e8; color: #c0392b; }
    .no-action { color: #999; }
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal {
      background: white;
      padding: 32px;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
    }
    .modal h3 { margin-bottom: 20px; }
    .modal form { display: flex; flex-direction: column; gap: 12px; }
    .modal input, .modal select {
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
    }
    .modal-actions { display: flex; gap: 12px; margin-top: 8px; }
    .btn-cancel {
      flex: 1;
      padding: 12px;
      border: 1px solid #ddd;
      background: white;
      border-radius: 8px;
    }
    .btn-save {
      flex: 1;
      padding: 12px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
    }
  `]
})
export class UsersComponent implements OnInit {
  users: any[] = [];
  showModal = false;
  isEditing = false;
  editingId = '';
  form = { name: '', email: '', password: '', role: 'user', status: 'active' };
  currentUserRole = '';
  error = '';
  modalError = '';

  constructor(private api: ApiService, private auth: AuthService) {
    const user = this.auth.getUser();
    this.currentUserRole = user?.role || '';
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.api.getUsers().subscribe({
      next: data => this.users = data,
      error: err => this.error = err.error?.message || 'Failed to load users'
    });
  }

  canModify(user: any): boolean {
    if (user.role === 'superadmin') return false;
    if (this.currentUserRole === 'superadmin') return true;
    if (this.currentUserRole === 'admin' && user.role === 'user') return true;
    return false;
  }

  openModal() {
    this.form = { name: '', email: '', password: '', role: 'user', status: 'active' };
    this.isEditing = false;
    this.modalError = '';
    this.showModal = true;
  }

  editUser(user: any) {
    this.form = { ...user, password: '' };
    this.editingId = user._id;
    this.isEditing = true;
    this.modalError = '';
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveUser() {
    this.modalError = '';
    const action = this.isEditing
      ? this.api.updateUser(this.editingId, this.form)
      : this.api.createUser(this.form);

    action.subscribe({
      next: () => {
        this.closeModal();
        this.loadUsers();
      },
      error: err => this.modalError = err.error?.message || 'Operation failed'
    });
  }

  deleteUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.api.deleteUser(id).subscribe({
        next: () => this.loadUsers(),
        error: err => this.error = err.error?.message || 'Delete failed'
      });
    }
  }
}
