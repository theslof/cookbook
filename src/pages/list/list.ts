import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {ItemPage} from "../item/item";
import {RecipesProvider, Recipe} from "../../providers/recipes/recipes";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
//  items: Promise<Recipe[]>;
  recipes: Recipe[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private recipeProvider: RecipesProvider, private alertCtrl: AlertController) {
  }

  ionViewWillEnter(){
    this.recipeProvider.getRecipes()
      .then((data:Recipe[]) => {
      this.recipes = data;
    })
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
            recipe.index = this.recipes.length;
            this.recipes.push(recipe);
            this.recipeProvider.saveRecipes(this.recipes)
              .then((data:Recipe[]) => {
                this.recipes = data;
              });
          }
        }
      ]
    });
    prompt.present();
  }

  init(){
    this.recipeProvider.initData()
      .then((data:Recipe[]) => {
        this.recipes = data;
      });
  }
}
