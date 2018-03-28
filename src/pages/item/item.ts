import {Component} from '@angular/core';
import {AlertController, IonicPage, NavParams, reorderArray} from 'ionic-angular';
import {Recipe, RecipesProvider} from "../../providers/recipes/recipes";
import {Timer, TimerProvider} from "../../providers/timer/timer";

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage {
  uuid: string;
  selectedRecipe: Recipe = <Recipe>{};
  favorite: boolean;
  editing: number = -1;
  timer: Timer = {
    id: 0,
    time: 0,
    current: 0,
    asText: '0s',
    uuid: '',
    name: '',
    stepID: -1,
  };

  constructor(public navParams: NavParams, public alertCtrl: AlertController,
              private recipesProvider: RecipesProvider, public timerProvider: TimerProvider) {
    // If we navigated to this page, we will have an item available as a nav param
    this.uuid = navParams.get('uuid');
    this.favorite = this.recipesProvider.isFavorite(this.uuid);
    this.recipesProvider.getRecipe(this.uuid).then((recipe: Recipe) => {
      this.selectedRecipe = recipe;
    });
    timerProvider.getTimer().subscribe((timer: Timer) => {
      this.timer = timer;
    });
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
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Add',
          handler: data => {
            console.log('Add clicked');
            this.selectedRecipe.ingredients.push({quantity: data.quantity, name: data.name});
            this.saveChanges();
          }
        }
      ]
    });
    prompt.present();
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
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            console.log('Saved clicked');
            ingredient.name = data.name;
            ingredient.quantity = data.quantity;
            this.saveChanges();
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
          handler: () => {
            console.log('No clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            console.log('Yes clicked');
            let index: number = this.selectedRecipe.ingredients.indexOf(ingredient);
            this.selectedRecipe.ingredients.splice(index, 1);
            this.saveChanges();
          }
        }
      ]
    });
    prompt.present();
  }

  addStep() {
    this.selectedRecipe.timers.push(0);
    this.selectedRecipe.steps.push('');
    this.saveChanges()
      .then(() => {
        let step = document.getElementById('step_' + (this.selectedRecipe.steps.length - 1));
        step.focus();
      });
  }

  editTimer(index: number) {
    let prompt = this.alertCtrl.create({
      title: 'Edit timer',
      message: "Modify the timer (minutes):",
      inputs: [
        {
          name: 'timer',
          placeholder: 'Timer (minutes)',
          type: 'number',
          min: 0,
          value: this.selectedRecipe.timers[index].toString()
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
            console.log('Saved clicked');
            let time = Number(data.timer);
            if (isNaN(time)) {
              console.log('Error: Timer must be a number');
              return;
            }
            this.selectedRecipe.timers[index] = time;
            this.saveChanges();
          }
        }
      ]
    });
    prompt.present();
  }

  deleteStep(index: number, silent?: boolean) {
    if(silent){
      this.selectedRecipe.steps.splice(index, 1);
      this.selectedRecipe.timers.splice(index, 1);
      this.saveChanges();
      return;
    }
    let prompt = this.alertCtrl.create({
      title: 'Remove step',
      message: `Do you want to remove this step?`,
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
            this.selectedRecipe.steps.splice(index, 1);
            this.selectedRecipe.timers.splice(index, 1);
            this.saveChanges();
          }
        }
      ]
    });
    prompt.present();
  }

  setTimer(index: number) {
    this.timerProvider.setTimer(this.uuid, this.selectedRecipe.name, index, this.selectedRecipe.timers[index] * 60)
  }

  addFavorite() {
    this.recipesProvider.addFavorite(this.uuid);
    this.favorite = true;
  }

  removeFavorite() {
    this.recipesProvider.removeFavorite(this.uuid);
    this.favorite = false;
  }

  reorderIngredients(event) {
    this.selectedRecipe.ingredients = reorderArray(this.selectedRecipe.ingredients, event);
    this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
  }

  reorderSteps(event) {
    this.selectedRecipe.steps = reorderArray(this.selectedRecipe.steps, event);
    this.selectedRecipe.timers = reorderArray(this.selectedRecipe.timers, event);
    this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
  }

  editStep(index: number, text: string) {
    this.editing = -1;
    if(text == null || text.replace(/\s/g,'') == ''){
      this.deleteStep(index, true);
      return;
    }
    this.selectedRecipe.steps[index] = text;
    this.saveChanges();
  }

  saveChanges(): Promise<any> {
    return this.recipesProvider.saveRecipe(this.uuid, this.selectedRecipe);
  }
}
