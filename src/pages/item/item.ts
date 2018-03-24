import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {Recipe, RecipesProvider} from "../../providers/recipes/recipes";
import {Timer, TimerProvider} from "../../providers/timer/timer";

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage {
  uuid: string;
  selectedRecipe: Recipe;
  timer: Timer = {
    id: 0,
    time: 0,
    current: 0,
    asText: '0s',
    uuid: '',
    stepID: -1,
  };

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, private recipesProvider: RecipesProvider,
              public timerProvider: TimerProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.uuid = navParams.get('uuid');
    this.recipesProvider.getRecipe(this.uuid).then((recipe: Recipe) => {
      this.selectedRecipe = recipe;
    });
    timerProvider.getTimer().subscribe((timer:Timer) => {
      this.timer = timer;
    });
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
            this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
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
            this.selectedRecipe.ingredients.push({quantity: data.quantity, name: data.name});
            this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
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
            let index: number = this.selectedRecipe.ingredients.indexOf(ingredient);
            this.selectedRecipe.ingredients.splice(index, 1);
            this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
          }
        }
      ]
    });
    prompt.present();
  }

  addStep() {
    let prompt = this.alertCtrl.create({
      title: 'Add step',
      message: "Set a timer (minutes) and directions:",
      inputs: [
        {
          name: 'timer',
          placeholder: 'Timer (minutes)',
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
            this.selectedRecipe.timers.push(time);
            this.selectedRecipe.steps.push(data.step);
            this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
          }
        }
      ]
    });
    prompt.present();
  }

  editStep(index: number) {
    let prompt = this.alertCtrl.create({
      title: 'Edit step',
      message: "Modify the timer (minutes) and/or directions:",
      inputs: [
        {
          name: 'timer',
          placeholder: 'Timer (minutes)',
          type: 'number',
          value: this.selectedRecipe.timers[index].toString()
        },
        {
          name: 'step',
          placeholder: 'Directions',
          value: this.selectedRecipe.steps[index]
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
            this.selectedRecipe.timers[index] = time;
            this.selectedRecipe.steps[index] = data.step;
            this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
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
            this.selectedRecipe.steps.splice(index, 1);
            this.selectedRecipe.timers.splice(index, 1);
            this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
          }
        }
      ]
    });
    prompt.present();
  }

  setTimer(index: number){
    this.timerProvider.setTimer(this.uuid, index, this.selectedRecipe.timers[index] * 60)
  }
}
