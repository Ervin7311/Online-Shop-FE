import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CardService } from '../../services/card.service';
import { FavoriteService } from '../../services/favorite.service';
import { CustomCurrencyPipe } from '../../pipes/custom-currency-pipe.pipe';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-card',
  imports: [CustomCurrencyPipe, NgIf],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input() id: any;
  @Input() imageUrl: any;
  @Input() name: any;
  @Input() description: any;
  @Input() price: any;
  @Input() isSold: boolean = false;

  @Output() productToFavoriteEmit: any = new EventEmitter<any>();
  @Output() productToCardEmit: any = new EventEmitter<any>();

  cardItems: any[] = [];
  favoriteItems: any[] = [];


  constructor(public cardService: CardService,
    public favoriteService: FavoriteService
  ) { }

  ngOnInit(): void { }

  addToCart(productId: number) {
    this.productToCardEmit.emit({ id: this.id, imageUrl: this.imageUrl, name: this.name, description: this.description, price: this.price, isSold: this.isSold });
  }

  addToFavorites(productId: number) {
    this.productToFavoriteEmit.emit({ id: this.id, imageUrl: this.imageUrl, name: this.name, description: this.description, price: this.price });
  }
}

