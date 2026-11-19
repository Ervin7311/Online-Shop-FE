import { CurrencyPipe, DecimalPipe, NgFor, NgIf, SlicePipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { User } from '../../interface/user';
import { UserService } from '../Service/user.service';
import { DashboardDateRange, DashboardService } from './dashboard.service';

interface ChartItem {
  label: string;
  value: number;
}

type DashboardResponse = Record<string, unknown> | unknown[] | null;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CurrencyPipe, DecimalPipe, NgFor, NgIf, FormsModule, SlicePipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  selectedRange = '30';
  customStartDate = '';
  customEndDate = '';
  loading = false;
  errorMessage = '';
  summary: Record<string, number | null> = {
    totalProducts: null,
    totalUsers: null,
    totalOrders: null,
    totalRevenue: null
  };
  sales: ChartItem[] = [];
  orders: ChartItem[] = [];
  registrations: ChartItem[] = [];
  stock: ChartItem[] = [];
  favorites: ChartItem[] = [];
  roles: ChartItem[] = [];
  users: User[] = [];
  usersLoading = false;
  usersError = '';
  selectedUserRole: 'ALL' | 'USER' | 'ADMIN' = 'ALL';

  readonly pieColors = ['#43a889', '#f3ae4b', '#e36b72', '#7185e8', '#42a9c2'];

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
    this.loadUsers();
  }

  get filteredUsers(): User[] {
    return this.users.filter(user => {
      const role = (user.role ?? '').toUpperCase();
      return (role === 'USER' || role === 'ADMIN') &&
        (this.selectedUserRole === 'ALL' || role === this.selectedUserRole);
    });
  }

  loadUsers(): void {
    this.usersLoading = true;
    this.usersError = '';
    this.userService.getAllUsers().subscribe({
      next: users => {
        this.users = users;
        this.usersLoading = false;
      },
      error: error => {
        console.error('Failed to load dashboard users:', error);
        this.usersError = this.getRequestErrorMessage(error, 'users');
        this.usersLoading = false;
      }
    });
  }

  onRangeChange(): void {
    if (this.selectedRange !== 'custom') this.loadDashboard();
  }

  applyCustomRange(): void {
    if (this.customStartDate && this.customEndDate && !this.customRangeInvalid()) {
      this.loadDashboard();
    }
  }

  loadDashboard(): void {
    const range = this.getDateRange();
    if (!range) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.summary = {
      totalProducts: null,
      totalUsers: null,
      totalOrders: null,
      totalRevenue: null
    };
    this.sales = [];
    this.orders = [];
    this.registrations = [];
    this.stock = [];
    this.favorites = [];
    this.roles = [];

    forkJoin({
      summary: this.dashboardService.getSummary(range),
      sales: this.dashboardService.getSales(range),
      orders: this.dashboardService.getOrders(range),
      registrations: this.dashboardService.getUsers(range),
      stock: this.dashboardService.getProductStock(range),
      favorites: this.dashboardService.getTopFavoriteProducts(range),
      roles: this.dashboardService.getUserRoles(range)
    }).subscribe({
      next: results => {
        this.setSummary(results.summary);
        this.sales = this.toItems(results.sales, ['revenue'], ['month']);
        this.orders = this.toItems(results.orders, ['orderCount'], ['month']);
        this.registrations = this.toItems(results.registrations, ['userCount'], ['month']);
        this.stock = this.toItems(results.stock, ['count'], ['status']);
        this.favorites = this.toItems(results.favorites, ['favoriteCount'], ['productName']);
        this.roles = this.toItems(results.roles, ['count'], ['role'])
          .filter(item => item.label.toUpperCase() === 'USER' || item.label.toUpperCase() === 'ADMIN');
        this.loading = false;
      },
      error: error => {
        console.error('Failed to load dashboard data:', error);
        this.errorMessage = this.getRequestErrorMessage(error, 'dashboard data');
        this.loading = false;
      }
    });
  }

  linePoints(items: ChartItem[]): string {
    if (!items.length) return '';
    const max = Math.max(...items.map(item => item.value), 1);
    return items.map((item, index) => {
      const x = items.length === 1 ? 500 : 24 + index * (952 / (items.length - 1));
      const y = 180 - (item.value / max) * 156;
      return `${x},${y}`;
    }).join(' ');
  }

  pointX(index: number, items: ChartItem[]): number {
    return items.length === 1 ? 500 : 24 + index * (952 / (items.length - 1));
  }

  pointY(item: ChartItem, items: ChartItem[]): number {
    const max = Math.max(...items.map(value => value.value), 1);
    return 180 - (item.value / max) * 156;
  }

  barWidth(value: number, items: ChartItem[]): string {
    const max = Math.max(...items.map(item => item.value), 1);
    return `${Math.max((value / max) * 100, value > 0 ? 2 : 0)}%`;
  }

  pieGradient(items: ChartItem[]): string {
    const total = items.reduce((sum, item) => sum + Math.max(item.value, 0), 0);
    if (!total) return 'conic-gradient(#e9edf2 0deg 360deg)';

    let start = 0;
    const slices = items.map((item, index) => {
      const end = start + Math.max(item.value, 0) / total * 360;
      const slice = `${this.pieColors[index % this.pieColors.length]} ${start}deg ${end}deg`;
      start = end;
      return slice;
    });
    return `conic-gradient(${slices.join(', ')})`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-IE').format(value);
  }

  formatNullableNumber(value: number | null): string {
    return value === null ? '—' : this.formatNumber(value);
  }

  customRangeInvalid(): boolean {
    return this.selectedRange === 'custom' &&
      !!this.customStartDate &&
      !!this.customEndDate &&
      this.customStartDate > this.customEndDate;
  }

  private getRequestErrorMessage(error: unknown, resource: string): string {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 401) return 'Your session has expired. Please sign in again.';
      if (error.status === 403) return 'You are not authorized to view this data.';
    }
    return `Unable to load ${resource}. Please try again later.`;
  }

  private getDateRange(): DashboardDateRange | null {
    const end = new Date();
    const start = new Date(end);
    if (this.selectedRange === 'custom') {
      if (!this.customStartDate || !this.customEndDate || this.customStartDate > this.customEndDate) {
        return null;
      }
      return { startDate: this.customStartDate, endDate: this.customEndDate };
    }

    if (this.selectedRange === '90' || this.selectedRange === '180') {
      const months = this.selectedRange === '90' ? 3 : 6;
      const day = start.getDate();
      start.setDate(1);
      start.setMonth(start.getMonth() - months);
      const lastDayOfMonth = new Date(start.getFullYear(), start.getMonth() + 1, 0).getDate();
      start.setDate(Math.min(day, lastDayOfMonth));
    } else {
      start.setDate(start.getDate() - Number(this.selectedRange));
    }
    return { startDate: this.toDateString(start), endDate: this.toDateString(end) };
  }

  private toDateString(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private setSummary(response: unknown): void {
    const data = this.asRecord(this.unwrap(response));
    this.summary = {
      totalProducts: this.readNumber(data, ['totalProducts', 'products']),
      totalUsers: this.readNumber(data, ['totalUsers', 'users']),
      totalOrders: this.readNumber(data, ['totalOrders', 'orders']),
      totalRevenue: this.readNumber(data, ['totalRevenue', 'revenue'])
    };
  }

  private toItems(response: unknown, valueKeys: string[], labelKeys: string[]): ChartItem[] {
    const data = this.unwrap(response);
    if (Array.isArray(data)) {
      return data.map((entry, index) => {
        const row = this.asRecord(entry);
        const value = this.readNumber(row, valueKeys);
        const label = this.readLabel(row, labelKeys) ?? `Item ${index + 1}`;
        return value === null ? null : { label: this.formatLabel(label), value };
      }).filter((item): item is ChartItem => item !== null);
    }

    const record = this.asRecord(data);
    return Object.entries(record).reduce<ChartItem[]>((items, [label, rawValue]) => {
      if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
        items.push({ label: this.formatLabel(label), value: rawValue });
      } else if (rawValue && typeof rawValue === 'object') {
        const value = this.readNumber(this.asRecord(rawValue), valueKeys);
        if (value !== null) items.push({ label: this.formatLabel(label), value });
      }
      return items;
    }, []);
  }

  private unwrap(value: unknown): DashboardResponse {
    if (Array.isArray(value)) return value;
    const record = this.asRecord(value);
    if ('data' in record) {
      return Array.isArray(record['data']) || (record['data'] !== null && typeof record['data'] === 'object')
        ? record['data'] as DashboardResponse
        : value as DashboardResponse;
    }
    return value as DashboardResponse;
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return value !== null && typeof value === 'object' && !Array.isArray(value)
      ? value as Record<string, unknown>
      : {};
  }

  private readNumber(record: Record<string, unknown>, keys: string[]): number | null {
    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
    }
    return null;
  }

  private readLabel(record: Record<string, unknown>, keys: string[]): string | null {
    for (const key of keys) {
      const value = record[key];
      if (typeof value === 'string' || typeof value === 'number') return String(value);
    }
    return null;
  }

  private formatLabel(label: string): string {
    const date = new Date(label);
    if (/^\d{4}-\d{2}(-\d{2})?$/.test(label) && !Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat('en-IE', { month: 'short', year: '2-digit' }).format(date);
    }
    return label;
  }
}
