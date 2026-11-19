import { EventEmitter, Injectable, Output, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getCartItems() {
    throw new Error('Method not implemented.');
  }
  getProducts(): any[] {
    throw new Error('Method not implemented.');
  }


  private products = [
      {
        id: 1,
        name: 'MSI Katana GF66 Gaming Laptop',
        description: 'Laptop i fuqishëm gaming me GPU të avancuar dhe ekran 144Hz.',
        price: 1199.99,
        imageUrl: 'assets/images/mis-katana_gf66.jpg'
      },
      {
        id: 2,
        name: 'Skytech Blaze Gaming PC',
        description: 'Kompjuter desktop me Ryzen 5 dhe RTX 3060 Ti për performancë të lartë.',
        price: 999.99,
        imageUrl: 'assets/images/SkytechBlazeGamingPc.jpg'
      },
      {
        id: 3,
        name: 'ASUS TUF Gaming Monitor 27”',
        description: 'Monitor gaming 165Hz me panel IPS për ngjyra të sakta.',
        price: 279.99,
        imageUrl: 'assets/images/ASUSTUfMonitor.jfif'
      },
      {
        id: 4,
        name: 'Redragon K552 Mechanical Keyboard',
        description: 'Kalim i mekanik me dritë RGB dhe çelësa të kuq për reagim të shpejtë.',
        price: 49.99,
        imageUrl: 'assets/images/RedragonK552Keyboard.jfif'
      },
      {
        id: 5,
        name: 'Logitech G502 Hero Gaming Mouse',
        description: 'Mi i gaming me DPI të lartë dhe peshë të rregullueshme.',
        price: 59.99,
        imageUrl: 'assets/images/LogitechG502HeroMouse.jpg'
      },
      {
        id: 6,
        name: 'Razer BlackShark V2 Gaming Headset',
        description: 'Kërkesë gaming me audio të pastër dhe mikrofon me anulim zhurme.',
        price: 89.99,
        imageUrl: 'assets/images/RazerBlackSharkV2.jpg'
      },
      {
        id: 7,
        name: 'SteelSeries QcK+ Mousepad',
        description: 'Mousepad i madh me sipërfaqe të lëmuar për lëvizje të saktë.',
        price: 19.99,
        imageUrl: 'assets/images/SteelSeriesQcKMouspad.jfif'
      },
      {
        id: 8,
        name: 'Secretlab TITAN Evo Gaming Chair',
        description: 'Karrige ergonomike gaming me mbështetje të plotë për shpinën.',
        price: 449.99,
        imageUrl: 'assets/images/SecretlabTitanEvoChair.jfif'
      },
      {
        id: 9,
        name: 'HP Omen 25L Gaming Desktop',
        description: 'Kompjuter desktop me Intel i7 dhe RTX 3070 për performancë maksimale.',
        price: 1399.99,
        imageUrl: 'assets/images/download.jfif'
      },
      {
        id: 10,
        name: 'Alienware m15 R6 Gaming Laptop',
        description: 'Laptop gaming me RTX 3070 dhe refresh rate 360Hz.',
        price: 1699.99,
        imageUrl: 'assets/images/AlienwareM15R6Laptop.jfif'
      },
      {
        id: 11,
        name: 'NZXT Streaming Plus PC',
        description: 'Kompjuter i ndërtuar për streaming me Ryzen 7 dhe RTX 4060.',
        price: 1149.99,
        imageUrl: 'assets/images/NZXTStreamingPlusPc.jfif'
      },
      {
        id: 12,
        name: 'Corsair K95 RGB Platinum XT',
        description: 'Kalim i mekanik me çelësa makro dhe ndriçim RGB.',
        price: 199.99,
        imageUrl: 'assets/images/CorsairK95RGBPlatinumXT.jfif'
      }
  ];
  @Output() cartListUpdated = new EventEmitter<any[]>();
  @Output() favoriteListUpdated = new EventEmitter<any[]>();

  private cartItems: any[] = [];
  private favoriteItems: any[] = [];

  constructor() {}

  getProduct() {
    return this.products;
  }

  getArrayOfCartList(): any[] {
    return this.cartItems;
  }

  getArrayOfFavoriteList(): any[] {
    return this.favoriteItems;
  }

  addItemToCart(item: any): void {
    this.cartItems.push(item);
    console.log('Item added to cart:', item);
    this.cartListUpdated.emit(this.cartItems);
  }

  addItemToFavorite(item: any): void {
    this.favoriteItems.push(item);
    this.favoriteListUpdated.emit(this.favoriteItems);
  }

  deleteItemFromCart(itemToDelete: any): void {
    this.cartItems = this.cartItems.filter(item => item !== itemToDelete);
    this.cartListUpdated.emit(this.cartItems); 
  }

  deleteItemFromFavorite(itemToDelete: any): void {
    this.favoriteItems = this.favoriteItems.filter(item => item !== itemToDelete);
    this.favoriteListUpdated.emit(this.favoriteItems);  
  }
}
