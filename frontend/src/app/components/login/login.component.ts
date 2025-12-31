import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-page">
      <div class="login-card">
        <h1>Admin Dashboard</h1>
        <p class="subtitle">Sign in to continue</p>

        <form (ngSubmit)="submit()">
          <input type="email" [(ngModel)]="email" name="email" placeholder="Email" required>
          <input type="password" [(ngModel)]="password" name="password" placeholder="Password" required>
          <p class="error" *ngIf="error">{{ error }}</p>
          <button type="submit" class="btn-primary">Login</button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }
    .login-card {
      background: white;
      padding: 40px;
      border-radius: 12px;
      box-shadow: 0 10px 40px rgba(0,0,0,0.2);
      width: 100%;
      max-width: 380px;
    }
    h1 { text-align: center; color: #333; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #888; margin-bottom: 24px; }
    form { display: flex; flex-direction: column; gap: 12px; }
    input {
      padding: 12px 16px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 14px;
    }
    input:focus { outline: none; border-color: #667eea; }
    .btn-primary {
      padding: 14px;
      background: #667eea;
      color: white;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      margin-top: 8px;
    }
    .btn-primary:hover { background: #5a6fd6; }
    .error { color: #e74c3c; font-size: 13px; text-align: center; }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.error = '';
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate(['/dashboard']),
      error: (err) => this.error = err.error?.message || 'Something went wrong'
    });
  }
}
