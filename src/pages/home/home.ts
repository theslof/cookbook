import {Component} from '@angular/core';
import {NavController, Platform} from 'ionic-angular';
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
  menuIcon: string = 'custom-logo';

  constructor(public navCtrl: NavController, private recipeProvider: RecipesProvider, private pltf: Platform) {
    if(pltf.is('ios'))
      this.menuIcon = 'menu';
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
