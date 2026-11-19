import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FavorietsComponent } from './favoriets/favoriets.component';
import { ShopComponent } from './shop/shop.component';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { ProfileComponent } from './profile/profile.component';

import { UserManagmentComponent } from './Admin-Page/user-managment/User/user-managment.component';
import { OrdersComponent } from './Admin-Page/order/orders/orders.component';
import { ProductsComponent } from './Admin-Page/product/products/products.component';
import { DashboardComponent } from './Admin-Page/dashboard/dashboard.component';

import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin-guard.guard';
import { OrderComponent } from './order/order.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'dashboard', component: DashboardComponent, canActivate: [AdminGuard] },
  { path: 'shop', component: ShopComponent, canActivate: [AuthGuard] },
  { path: 'favoriets', component: FavorietsComponent, canActivate: [AuthGuard] },
  { path: 'shopping-cart', component: ShoppingCartComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'order', component: OrderComponent, canActivate: [AuthGuard] },

  { path: 'UserManagement', component: UserManagmentComponent, canActivate: [AdminGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AdminGuard] },
  { path: 'stoc', component: ProductsComponent, canActivate: [AdminGuard] },

  { path: '**', redirectTo: '/login' }
];
