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
    let prompt = this.alertCtrl.create({
      title: 'Delete recipe',
      message: `Do you want to permanently delete this recipe?`,
      buttons: [
        {
          text: 'No',
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            this.recipeProvider.deleteRecipe(uuid);
          }
        }
      ]
    });
    prompt.present();
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
      message: "Enter a name for a new recipe OR enter JSON data to import:",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
        },
        {
          name: 'json',
          placeholder: 'JSON data',
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
            if (data.name.replace(/\s/g, '') == '' && data.json.replace(/\s/g, '') == '') {
              console.log('No data entered, aborting');
              return;
            }

            let recipe: Recipe;
            if (data.json != '') {
              recipe = RecipesProvider.importRecipe(data.json);
              if (!recipe) {
                console.log('Couldn\'t parse JSON data, aborting');
                return;
              }
            } else {
              recipe = RecipesProvider.emptyRecipe();
              recipe.name = data.name;
            }
            let uuid = UUID.UUID();
            this.recipeProvider.saveRecipe(uuid, recipe)
              .then(() => this.navCtrl.push(ItemPage, {uuid: uuid}));
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
