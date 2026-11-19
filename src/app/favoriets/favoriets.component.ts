import { FavoriteService } from '../services/favorite.service';
import { NgFor } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CustomCurrencyPipe } from '../pipes/custom-currency-pipe.pipe';

@Component({
  selector: 'app-favoriets',
  imports: [NgFor, CustomCurrencyPipe],
  templateUrl: './favoriets.component.html',
  styleUrl: './favoriets.component.css'
})
export class FavorietsComponent implements OnInit {

  favoriteItems: any[] = [];

  constructor(private favoriteService: FavoriteService) { }

  ngOnInit(): void {

    this.getFavorites();

  }

  getFavorites() {
    this.favoriteService.getFavoriteItems().subscribe((data) => {
      this.favoriteItems = data;
      localStorage.setItem('favorite', JSON.stringify(data));
    },
      (error) => {
        const storedFavoriteItems = localStorage.getItem('favorite');
        if (storedFavoriteItems) {
          this.favoriteItems = JSON.parse(storedFavoriteItems);
        } else {
          this.favoriteItems = [];
        }
      }
    );
  }
  removeFavorite(id: any) {
    this.favoriteService.deleteItemFromFavorite(id).subscribe({
      next: () => {
        this.favoriteService.removeProductFromFavorite(id);
        this.favoriteItems = this.favoriteItems.filter(favorite => favorite.id !== id)
        console.log("items delete")
      }
    })
  }
}


