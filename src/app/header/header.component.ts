import { UserService } from './../services/user.service';
import { AuthService } from './../services/auth.service';
import { CommonModule } from '@angular/common';
import { Component, effect} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { FavoriteService } from '../services/favorite.service';
import { CardService } from '../services/card.service';

@Component({
  selector: 'app-header',
  imports: [RouterLinkActive, RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true
})
export class HeaderComponent {

  cartItems: any[] = [];

  favoriteItems: any[] = [];

  isAdmin = false;

  constructor(private cardService: CardService,
    public authService: AuthService,
    private userService: UserService,
    private favoriteService: FavoriteService,
    private router: Router ){
    effect(() => {
      this.cartItems = this.cardService.getProducts();
    });

    effect(() => {
      this.favoriteItems = this.favoriteService.getProducts();
    });

    this.cardService.loadCartItems();
    this.favoriteService.loadFavoritesItems();
    }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
    if (!user) {
      this.isAdmin = false;
      return;
    }
    this.isAdmin = user.role === 'ADMIN';
    console.log('User role:', user.role);
  });
  }
  getTotalPriceFavorite(): number {
    return this.favoriteItems.reduce((total, items) => total + items.product.price, 0);
  }


  getTotalPriceCart(): number {
    return this.cartItems.reduce((total, itmes) => total + itmes.product.price, 0);
  }

  cartDropdownVisible: boolean = false;

  cartDropdownVisibleCart: boolean = false;

  toggleCartDropdownFavorite(): void {
    this.cartDropdownVisible = !this.cartDropdownVisible;
    if (this.cartDropdownVisible) {
      this.cartDropdownVisibleCart = false;
    }
  }
  toggleCartDropdownCart(): void {
    this.cartDropdownVisibleCart = !this.cartDropdownVisibleCart;
    if (this.cartDropdownVisibleCart) {
      this.cartDropdownVisible = false;
    }
  }
  
  logout() {
  localStorage.clear();
  this.router.navigate(['/login']);
  }
}