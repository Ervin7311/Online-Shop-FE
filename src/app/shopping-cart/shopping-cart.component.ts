// import { Component, EventEmitter, Output, signal } from '@angular/core';
// import { CommonModule, NgFor} from '@angular/common';
// import { CardService } from '../services/card.service';
// import { CustomCurrencyPipe } from '../pipes/custom-currency-pipe.pipe';
// import { DirectiveStyleDirective } from '../directives/directive-style.directive';

// @Component({
//   selector: 'app-shopping-cart',
//   imports: [CommonModule, NgFor, CustomCurrencyPipe, DirectiveStyleDirective],
//   templateUrl: './shopping-cart.component.html',
//   styleUrl: './shopping-cart.component.css'
// })
// export class ShoppingCartComponent {


//   cartItems: any[] = [];
  
//   @Output() CardUpdated = new EventEmitter<any>(); 

//   constructor(private cardService: CardService) {}

//   ngOnInit(): void {

//     this.getCardItem();
    

//   }
//   getCardItem() {
//     this.cardService.getCartItems().subscribe(
//       (data) => {
//         this.cartItems = data;
//         localStorage.setItem('cart', JSON.stringify(data));
//       },
//       (error) => {
//         const storedCartItems = localStorage.getItem('cart');
//         if (storedCartItems) {
//           this.cartItems = JSON.parse(storedCartItems);
//         } else {
//           this.cartItems = [];
//         }
//       }
//     );
//   }

//   removeFromCard(id: any) {
//     this.cardService.deleteItemFromCart(id).subscribe({
//       next: () => {
//         this.cardService.removeProductFromCardSignal(id);
//         this.cartItems = this.cartItems.filter(card => card.id !== id);
//         this.CardUpdated.emit(this.cartItems);
//       }
//     });
//   }
  
//     this.http.post(`http://localhost:8080/api/orders/checkout/${userId}`, null, {
//         params: {
//           shippingAddress: this.shippingAddress,
//           paymentMethod: this.paymentMethod
//         }
//       }).subscribe({
//         next: (res) => {
//           alert('Order placed successfully!');
//           this.showCheckout = false;
//           this.cartItems = [];
//         },
//         error: (err) => {
//           console.error(err);
//           alert('Error placing order!');
//         }
//       });
//     }

// import { Component, EventEmitter, Output } from '@angular/core';
// import { CommonModule, NgFor } from '@angular/common';
// import { CardService } from '../services/card.service';
// import { CustomCurrencyPipe } from '../pipes/custom-currency-pipe.pipe';
// import { DirectiveStyleDirective } from '../directives/directive-style.directive';
// import { HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-shopping-cart',
//   standalone: true,
//   imports: [CommonModule, NgFor, CustomCurrencyPipe, DirectiveStyleDirective],
//   templateUrl: './shopping-cart.component.html',
//   styleUrl: './shopping-cart.component.css'
// })
// export class ShoppingCartComponent {

//   cartItems: any[] = [];
//   showCheckout: boolean = false;
//   shippingAddress: string = '';
//   paymentMethod: string = 'CARD';

//   @Output() CardUpdated = new EventEmitter<any>();

//   constructor(private cardService: CardService, private http: HttpClient) {}

//   ngOnInit(): void {
//     this.getCardItem();
//   }

//   getCardItem() {
//     this.cardService.getCartItems().subscribe(
//       (data) => {
//         this.cartItems = data;
//         localStorage.setItem('cart', JSON.stringify(data));
//       },
//       (error) => {
//         const storedCartItems = localStorage.getItem('cart');
//         this.cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
//       }
//     );
//   }

//   removeFromCard(id: any) {
//     this.cardService.deleteItemFromCart(id).subscribe({
//       next: () => {
//         this.cardService.removeProductFromCardSignal(id);
//         this.cartItems = this.cartItems.filter(card => card.id !== id);
//         this.CardUpdated.emit(this.cartItems);
//       }
//     });
//   }

//   openCheckoutModal() {
//     this.showCheckout = true;
//   }

//   closeCheckoutModal() {
//     this.showCheckout = false;
//   }

//   submitOrder() {
//     const userId = 22; // Vendose userId dinamik nqs e ke në authService
//     this.http.post(`http://localhost:8080/api/orders/checkout/${userId}`, null, {
//       params: {
//         shippingAddress: this.shippingAddress,
//         paymentMethod: this.paymentMethod
//       }
//     }).subscribe({
//       next: (res) => {
//         alert('Order placed successfully!');
//         this.showCheckout = false;
//         this.cartItems = [];
//         localStorage.removeItem('cart');
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Error placing order!');
//       }
//     });
//   }
// }

import { Component, EventEmitter, NgModule, Output } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { CardService } from '../services/card.service';
import { CustomCurrencyPipe } from '../pipes/custom-currency-pipe.pipe';
import { DirectiveStyleDirective } from '../directives/directive-style.directive';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, NgFor, CustomCurrencyPipe, DirectiveStyleDirective, FormsModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css'
})
export class ShoppingCartComponent {

  cartItems: any[] = [];
  showCheckout: boolean = false;
  shippingAddress: string = '';
  paymentMethod: string = 'CARD';

  @Output() CardUpdated = new EventEmitter<any>();


  constructor(private cardService: CardService, private http: HttpClient) {}

  ngOnInit(): void {
    this.getCardItem();
  }

//   onQuantityChange(item: any, event: Event): void {
//   const inputElement = event.target as HTMLInputElement;
//   const value = inputElement.value;
//   this.updateQuantity(item, value);
// }


  getCardItem() {
    this.cardService.getCartItems().subscribe(
      (data) => {
        this.cartItems = data;
        localStorage.setItem('cart', JSON.stringify(data));
      },
      (error) => {
        const storedCartItems = localStorage.getItem('cart');
        this.cartItems = storedCartItems ? JSON.parse(storedCartItems) : [];
      }
    );
  }

  removeFromCard(id: any) {
    this.cardService.deleteItemFromCart(id).subscribe({
      next: () => {
        this.cardService.removeProductFromCardSignal(id);
        this.cartItems = this.cartItems.filter(card => card.id !== id);
        this.CardUpdated.emit(this.cartItems);
      }
    });
  }

  openCheckoutModal() {
    this.showCheckout = true;
  }

  closeCheckoutModal() {
    this.showCheckout = false;
  }

  submitOrder() {
  const userId = localStorage.getItem('userId'); 
  console.log('User ID:', userId); 

  if (!userId) {
    alert('User is not logged in!');
    return;
  }

  const body = {
  shippingAddress: this.shippingAddress,
  paymentMethod: this.paymentMethod
};

this.http.post(`http://localhost:8080/api/orders/checkout/${userId}`, body)
  .subscribe({
    next: (res) => {
      alert('Order placed successfully!');
      this.showCheckout = false;
      this.cartItems = [];
      localStorage.removeItem('cart');
    },
    error: (err) => {
      console.error(err);
      alert('Error placing order!');
    }
  });
}
onQuantityChange(item: any, event: Event): void {
  const input = event.target as HTMLInputElement;
  const qty = parseInt(input.value, 10);

  if (qty <= 0 || isNaN(qty)) {
    input.value = item.quantity;
    return;
  }

  this.cardService.updateQuantity(item.id, qty).subscribe({
    next: () => {
      item.quantity = qty;
      this.updateCartStorage();
    }
  });
}
decreaseQuantity(item: any) {
  if (item.quantity > 1) {
    const newQty = item.quantity - 1;

    this.cardService.updateQuantity(item.id, newQty).subscribe({
      next: () => {
        item.quantity = newQty;
        this.updateCartStorage();
      }
    });
  }
}
increaseQuantity(item: any) {
  const newQty = item.quantity + 1;

  this.cardService.updateQuantity(item.id, newQty).subscribe({
    next: () => {
      item.quantity = newQty;
      this.updateCartStorage();
    }
  });
}


  // increaseQuantity(item: any) {
  //   item.quantity = (item.quantity || 1) + 1;
  //   this.updateCartStorage();
  // }

  // decreaseQuantity(item: any) {
  //   if ((item.quantity || 1) > 1) {
  //     item.quantity--;
  //     this.updateCartStorage();
  //   }
  // }

  updateQuantity(item: any, quantity: string) {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty > 0) {
      item.quantity = qty;
      this.updateCartStorage();
    } else {
      item.quantity = 1;
      this.updateCartStorage();
    }
  }

  private updateCartStorage() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.CardUpdated.emit(this.cartItems);
  }
}
