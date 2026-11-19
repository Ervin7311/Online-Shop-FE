import { CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Service/product.service';
import { Product } from '../../../interface/product';
import { FormsModule, NgModel } from '@angular/forms';

export interface Products {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, NgFor, FormsModule, NgIf ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})

export class ProductsComponent implements OnInit{

  products: Product[] = [];
  showAddForm = false;

  newProduct: Product = {name: '', description: '', price: 0, stockQuantity: 0, imageUrl: ''};

  constructor(private productsService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (err) => {
        console.error('Gabim gjatë ngarkimit të produkteve:', err);
      }
    });
  }

  toggleAddForm() {
    this.showAddForm = !this.showAddForm;
  }

  addProduct() {
    this.productsService.createProduct(this.newProduct).subscribe({
      next: (product) => {
        this.products.push(product);  
        this.newProduct = {id: 0, name: '', description: '', price: 0, stockQuantity: 0, imageUrl: '', createdAt: new Date().toISOString() };
        this.showAddForm = false;
      },
      error: (err) => {
        console.error('Gabim gjatë krijimit të produktit:', err);
      }
    });
  }

    deleteProduct(id: number): void {
    if (confirm('A jeni i sigurt që dëshironi të fshini këtë produkt?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.id !== id); 
        },
        error: (err) => {
          console.error('Gabim gjatë fshirjes së produktit:', err);
        }
      });
    }
  }
}

