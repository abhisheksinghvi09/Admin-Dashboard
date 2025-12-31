import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { ApiService } from '../../services/api.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  template: `
    <app-nav></app-nav>
    <div class="container">
      <h2>Dashboard Overview</h2>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon blue">U</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalUsers }}</span>
            <span class="stat-label">Total Users</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon green">A</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.activeUsers }}</span>
            <span class="stat-label">Active Users</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon purple">S</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.adminCount }}</span>
            <span class="stat-label">Admins</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon orange">+</div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.newSignups }}</span>
            <span class="stat-label">New This Week</span>
          </div>
        </div>
      </div>

      <div class="chart-container">
        <h3>Monthly Sign-ups</h3>
        <canvas #chartCanvas></canvas>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 32px; max-width: 1200px; margin: 0 auto; }
    h2 { color: #333; margin-bottom: 24px; }
    h3 { color: #333; margin-bottom: 16px; }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 20px;
      margin-bottom: 32px;
    }
    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .stat-icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .stat-icon.blue { background: #e8f0fe; }
    .stat-icon.green { background: #e6f4ea; }
    .stat-icon.purple { background: #f3e8ff; }
    .stat-icon.orange { background: #fef3e8; }
    .stat-value { font-size: 28px; font-weight: 600; color: #333; display: block; }
    .stat-label { color: #888; font-size: 14px; }
    .chart-container {
      background: white;
      padding: 24px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
  `]
})
export class DashboardComponent implements OnInit, AfterViewInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef<HTMLCanvasElement>;
  
  stats = { totalUsers: 0, activeUsers: 0, adminCount: 0, newSignups: 0 };
  chartData: any = null;

  constructor(private api: ApiService) {}

  ngOnInit() {
    this.api.getStats().subscribe(data => this.stats = data);
    this.api.getChartData().subscribe(data => {
      this.chartData = data;
      this.renderChart();
    });
  }

  ngAfterViewInit() {
    if (this.chartData) {
      this.renderChart();
    }
  }

  renderChart() {
    if (!this.chartCanvas || !this.chartData) return;
    
    new Chart(this.chartCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: this.chartData.labels,
        datasets: [{
          label: 'Sign-ups',
          data: this.chartData.signups,
          backgroundColor: '#667eea',
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }
}
