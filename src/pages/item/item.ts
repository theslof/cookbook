import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-item',
  templateUrl: 'item.html',
})
export class ItemPage {
  selectedItem: {
    name: string,
    ingredients: Array<{
      quantity: string,
      name: string,
    }>,
    steps: Array<string>,
    timers: Array<number>,
    imageUrl: string
  };

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
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
          }
        }
      ]
    });
    prompt.present();
  }

  deleteIngredient(ingredient: { quantity: string, name: string }){
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
          }
        }
      ]
    });
    prompt.present();
  }
}
