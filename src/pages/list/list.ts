import {Component} from '@angular/core';
import {AlertController, NavController, NavParams} from 'ionic-angular';
import {ItemPage} from "../item/item";
import {RecipesProvider, Recipe, RecipeIndex} from "../../providers/recipes/recipes";
import {UUID} from "angular2-uuid";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  recipes: RecipeIndex = {};
  index: string[] = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private recipeProvider: RecipesProvider, private alertCtrl: AlertController) {
    this.recipeProvider.getRecipes().subscribe((recipes: RecipeIndex) => {
      this.recipes = recipes;
      this.index = Object.keys(recipes);
    });
  }

  ionViewDidEnter(){
    this.recipes = this.recipeProvider.getIndex();
    this.index = Object.keys(this.recipes);
  }

  itemTapped(event, uuid) {
    // That's right, we're pushing to ourselves!
    this.navCtrl.push(ItemPage, {
      uuid: uuid
    });
  }

  deleteRecipe(uuid: string){
    this.recipeProvider.deleteRecipe(uuid);
  }

  editRecipe(uuid: string){
    let prompt = this.alertCtrl.create({
      title: 'Edit recipe',
      message: "Enter a new name for the recipe:",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
          value: this.recipes[uuid],
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
          text: 'Save',
          handler: data => {
            console.log('Save clicked');
            this.recipeProvider.changeRecipeName(uuid, data.name);
          }
        }
      ]
    });
    prompt.present();  }

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
            this.recipeProvider.saveRecipe(UUID.UUID(), recipe);
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
