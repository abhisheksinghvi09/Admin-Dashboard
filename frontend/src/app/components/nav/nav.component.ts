import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  template: `
    <nav class="navbar">
      <div class="brand">📊 Admin Dashboard</div>
      <div class="nav-links">
        <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
        <a routerLink="/users" routerLinkActive="active">Users</a>
        <button class="logout-btn" (click)="logout()">Logout</button>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: white;
      padding: 16px 32px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    .brand { font-size: 18px; font-weight: 600; color: #333; }
    .nav-links { display: flex; gap: 24px; align-items: center; }
    .nav-links a {
      color: #666;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 6px;
    }
    .nav-links a.active, .nav-links a:hover {
      color: #667eea;
      background: #f0f4ff;
    }
    .logout-btn {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      font-weight: 500;
    }
    .logout-btn:hover { background: #c0392b; }
  `]
})
export class NavComponent {
  constructor(private auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
