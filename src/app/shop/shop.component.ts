import { Component, computed } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CardComponent } from "./card/card.component";
import { ProductsService } from '../services/products.service';
import { FavoriteService } from '../services/favorite.service';
import { CardService } from '../services/card.service';
import { DirectiveStyleDirective } from '../directives/directive-style.directive';


@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [CommonModule, RouterModule, CardComponent, DirectiveStyleDirective],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.css'
})
export class ShopComponent {

  products: any[] = [];
  cartItems: any[] = [];

  constructor(private productsService: ProductsService,
    private cardService: CardService,
    private favoriteService: FavoriteService) { }

  ngOnInit(): void {
    this.cardService.loadCartItems();
    this.getProducts();
  }

  getProducts() {
    this.productsService.getProducts().subscribe((data) => {
      const cartItems = this.cardService.getProducts();

      this.products = data.map(product => ({ ...product, isSold: !!cartItems.find(item => item.product?.id === product.id) }));

    });
  }

  isAllCartItemsUnsold(): boolean {
    return this.cardService.getProducts().every(item => item.isSold === false);
  }

  logFavData(product: any) {
    this.favoriteService.addItemToFavorite(product.id).subscribe(() => {
      this.favoriteService.loadFavoritesItems();
    })
  }

  logCardData(product: any) {
    this.cardService.addItemToCart(product.id).subscribe({
      next: () => {
        this.cardService.loadCartItems();
        let foundProduct = this.products.find((item: any) => item.id === product.id);
        if (foundProduct) {
          foundProduct.isSold = true;
        }
      },
      error: (err) => {
        console.error('Gabim gjatë shtimit në cart:', err);
      }
    });
  }
}



