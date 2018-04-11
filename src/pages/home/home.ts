import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {ItemPage} from "../item/item";
import {RecipeIndex, RecipesProvider} from "../../providers/recipes/recipes";
import {ListPage} from "../list/list";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  recipes: RecipeIndex = {};
  index: string[] = [];

  constructor(public navCtrl: NavController, private recipeProvider: RecipesProvider) {
    this.recipeProvider.getFavorites().subscribe((recipes: RecipeIndex) => {
      this.recipes = recipes;
      this.index = Object.keys(recipes);
    });
  }

  itemTapped(event, uuid) {
    this.navCtrl.push(ItemPage, {
      uuid: uuid
    });
  }

  removeFavorite(uuid: string) {
    this.recipeProvider.removeFavorite(uuid);
  }

  openList() {
    this.navCtrl.setRoot(ListPage);
  }
}
