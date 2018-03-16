import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {ItemPage} from "../item/item";
import {RecipesProvider} from "../../providers/recipes/recipes";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  items: Array<{
    name: string,
    ingredients: Array<{
      quantity: string,
      name: string,
      type: string
    }>,
    steps: Array<string>,
    timers: Array<number>,
    imageUrl: string
  }>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private recipeProvider: RecipesProvider) {
  }

  ionViewWillEnter(){
    this.items = this.recipeProvider.getRecipes();
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ItemPage, {
      item: item
    });
  }
}
