import { Component, OnInit } from '@angular/core';
import { Order, OrderService } from '../../Service/order.service';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Modal } from 'bootstrap'; 
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [NgFor, CurrencyPipe, DatePipe, NgClass, FormsModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  selectedOrderItems: any[] = [];
  loading = true;
  error: string | null = null;

  selectedYear: number = new Date().getFullYear();
  selectedMonth: number | null = null;

  years: number[] = [2023, 2024, 2025, 2026, 2027];

  months = [
    { value: 1, name: "January" },
    { value: 2, name: "February" },
    { value: 3, name: "March" },
    { value: 4, name: "April" },
    { value: 5, name: "May" },
    { value: 6, name: "June" },
    { value: 7, name: "July" },
    { value: 8, name: "August" },
    { value: 9, name: "September" },
    { value: 10, name: "October" },
    { value: 11, name: "November" },
    { value: 12, name: "December" },
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.orderService.getAllOrders().subscribe({
      next: data => {
        console.log('Orders loaded:', data); 
        this.orders = data;
        this.loading = false;
      },
      error: err => {
        this.error = 'Error loading orders';
        this.loading = false;
      }
    });
  }

viewOrderItems(order: Order) {
  console.log('Selected order:', order);
  console.log('Order items:', order.items);  

  this.selectedOrderItems = order.items ?? [];

  console.log('Selected order items:', this.selectedOrderItems);

  const modalElement = document.getElementById('orderItemsModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
}
exportExcel() {
  let url = `http://localhost:8080/orders/export?year=${this.selectedYear}`;

  if (this.selectedMonth !== null) {
    url += `&month=${this.selectedMonth}`;
  }

  this.orderService.downloadReport(url).subscribe({
    next: (data: Blob) => {
      const blob = new Blob([data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = `orders_${this.selectedYear}${this.selectedMonth ? "_" + this.selectedMonth : ""}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
    },
    error: err => {
      console.error("Download failed", err);
    }
  });
}
openExportModal() {
  const modalElement = document.getElementById('exportModal');
  if (modalElement) {
    const modal = new Modal(modalElement);
    modal.show();
  }
}
}
