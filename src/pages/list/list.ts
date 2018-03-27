import {Component, ViewChild} from '@angular/core';
import {AlertController, NavController, Searchbar} from 'ionic-angular';
import {ItemPage} from "../item/item";
import {RecipesProvider, Recipe, RecipeIndex} from "../../providers/recipes/recipes";
import {UUID} from "angular2-uuid";

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  @ViewChild('filterInput') searchbar: Searchbar;
  recipes: RecipeIndex = {};
  index: string[] = [];
  searching: boolean = false;
  searchString: string = '';

  constructor(public navCtrl: NavController, private recipeProvider: RecipesProvider,
              private alertCtrl: AlertController) {
    this.recipeProvider.getRecipes().subscribe((recipes: RecipeIndex) => {
      this.recipes = recipes;
      this.filterIndex();
    });
  }

  itemTapped(event, uuid) {
    this.navCtrl.push(ItemPage, {
      uuid: uuid
    });
  }

  deleteRecipe(uuid: string) {
    this.recipeProvider.deleteRecipe(uuid);
  }

  editRecipe(uuid: string) {
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
          handler: () => {
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
    prompt.present();
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
          handler: () => {
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

  toggleSearch() {
    this.searching = true;
    setTimeout(() => this.searchbar.setFocus(), 100);
  }

  clearSearch() {
    this.searchString = '';
    this.filterIndex();
  }

  filterIndex() {
    this.index = Object.keys(this.recipes).filter(value => this.indexFilter(value));
  }

  indexFilter(value: string) {
//    console.log(`Filtering: Does '${this.recipes[value]}' match '${this.searchString}?'`);
    if (this.searchString == null || this.searchString == '')
      return true;
    return this.recipes[value].toLowerCase().indexOf(this.searchString.toLowerCase()) >= 0;
  }
}
