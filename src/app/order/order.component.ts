import { Component, OnInit } from '@angular/core';
import { OrderService, OrderWithItemsDto } from '../Admin-Page/Service/order.service';
import { CurrencyPipe, DatePipe, NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-order',
  imports: [DatePipe, CurrencyPipe, NgFor, NgIf, NgClass],
  standalone: true,
  templateUrl: './order.component.html',
  styleUrl: './order.component.css'
})
export class OrderComponent implements OnInit {

  orders: OrderWithItemsDto[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        console.log('Orders:', data);
        this.orders = data;
      },
      error: (err) => {
        console.error('Failed to fetch orders:', err);
      }
    });
  }
}
