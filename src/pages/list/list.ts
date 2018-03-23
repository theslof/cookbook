import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {ItemPage} from "../item/item";
import {RecipesProvider, Recipe} from "../../providers/recipes/recipes";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
//  items: Promise<Recipe[]>;
  recipes: Recipe[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private recipeProvider: RecipesProvider, private alertCtrl: AlertController) {
    this.recipeProvider.getRecipes().subscribe((recipes: Recipe[]) => {
      this.recipes = recipes;
    });
  }

  ionViewWillEnter(){
  }

  itemTapped(event, item) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ItemPage, {
      item: item
    });
  }

  deleteRecipe(item: Recipe){
    item.removed = true;
    this.recipeProvider.saveRecipe(item);
  }

  editRecipe(item: Recipe){
    console.log("Not yet implemented!");
  }

  addRecipe() {
    let prompt = this.alertCtrl.create({
      title: 'New recipe',
      message: "Enter a name for the recipe:",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            console.log('Add clicked');
            let recipe: Recipe = RecipesProvider.emptyRecipe();
            recipe.name = data.name;
            this.recipeProvider.saveRecipe(recipe);
          }
        }
      ]
    });
    prompt.present();
  }

  init(){
    this.recipeProvider.initData();
  }
}
