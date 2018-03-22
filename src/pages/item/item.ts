import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Recipe, RecipesProvider} from "../../providers/recipes/recipes";

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage {
  selectedItem: Recipe;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, private recipesProvider: RecipesProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.selectedItem = navParams.get('item');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ItemPage');
  }

  editIngredient(ingredient: { quantity: string, name: string }) {
    let prompt = this.alertCtrl.create({
      title: 'Edit ingredient',
      message: "Modify the quantity and/or name for the ingredient:",
      inputs: [
        {
          name: 'quantity',
          placeholder: 'Quantity',
          value: ingredient.quantity
        },
        {
          name: 'name',
          placeholder: 'Ingredient',
          value: ingredient.name
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
            console.log('Saved clicked');
            ingredient.name = data.name;
            ingredient.quantity = data.quantity;
            this.recipesProvider.saveRecipe(this.selectedItem);
          }
        }
      ]
    });
    prompt.present();
  }

  addIngredient() {
    let prompt = this.alertCtrl.create({
      title: 'Add ingredient',
      message: "Enter a quantity and name for the ingredient:",
      inputs: [
        {
          name: 'quantity',
          placeholder: 'Quantity',
        },
        {
          name: 'name',
          placeholder: 'Ingredient',
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
            this.selectedItem.ingredients.push({quantity: data.quantity, name: data.name});
            this.recipesProvider.saveRecipe(this.selectedItem);
          }
        }
      ]
    });
    prompt.present();
  }

  deleteIngredient(ingredient: { quantity: string, name: string }) {
    let prompt = this.alertCtrl.create({
      title: 'Remove ingredient',
      message: `Do you want to remove ${ingredient.name}?`,
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Yes clicked');
            let index: number = this.selectedItem.ingredients.indexOf(ingredient);
            this.selectedItem.ingredients.splice(index, 1);
            this.recipesProvider.saveRecipe(this.selectedItem);
          }
        }
      ]
    });
    prompt.present();
  }

  addStep() {
    let prompt = this.alertCtrl.create({
      title: 'Add step',
      message: "Set a timer and directions:",
      inputs: [
        {
          name: 'timer',
          placeholder: 'Timer',
          type: 'number',
          value: '0'
        },
        {
          name: 'step',
          placeholder: 'Directions',
          value: ''
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
            console.log('Saved clicked');
            let time = Number(data.timer);
            if (isNaN(time)) {
              console.log('Error: Timer must be a number');
              return;
            }
            this.selectedItem.timers.push(time);
            this.selectedItem.steps.push(data.step);
            this.recipesProvider.saveRecipe(this.selectedItem);
          }
        }
      ]
    });
    prompt.present();
  }

  editStep(index: number) {
    let prompt = this.alertCtrl.create({
      title: 'Edit step',
      message: "Modify the timer and/or directions:",
      inputs: [
        {
          name: 'timer',
          placeholder: 'Timer',
          type: 'number',
          value: this.selectedItem.timers[index].toString()
        },
        {
          name: 'step',
          placeholder: 'Directions',
          value: this.selectedItem.steps[index]
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
            console.log('Saved clicked');
            let time = Number(data.timer);
            if (isNaN(time)) {
              console.log('Error: Timer must be a number');
              return;
            }
            this.selectedItem.timers[index] = time;
            this.selectedItem.steps[index] = data.step;
            this.recipesProvider.saveRecipe(this.selectedItem);
          }
        }
      ]
    });
    prompt.present();
  }

  deleteStep(index: number) {
    let prompt = this.alertCtrl.create({
      title: 'Remove step',
      message: `Do you want to remove this step?`,
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Yes clicked');
            this.selectedItem.steps.splice(index, 1);
            this.selectedItem.timers.splice(index, 1);
            this.recipesProvider.saveRecipe(this.selectedItem);
          }
        }
      ]
    });
    prompt.present();
  }

  setTimer(index: number) {
  }
}
