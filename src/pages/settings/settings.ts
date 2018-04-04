import { Component } from '@angular/core';
import {AlertController, IonicPage, Platform} from 'ionic-angular';
import {RecipesProvider} from "../../providers/recipes/recipes";
import {PreferencesProvider} from "../../providers/preferences/preferences";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  theme: string;
  menuIcon: string = 'custom-logo';

  constructor(public recipeProvider: RecipesProvider, private alertCtrl: AlertController,
              private prefs: PreferencesProvider, private pltf: Platform) {
    if(pltf.is('ios'))
      this.menuIcon = 'menu';
    this.prefs.getTheme().subscribe(theme => this.theme = theme);
  }

  setTheme(theme) {
    this.prefs.setTheme(theme);
  }

  init(){
    let prompt = this.alertCtrl.create({
      title: 'Initialize DB',
      message: `This will replace your saved data with dummy data. Are you sure?`,
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
            this.recipeProvider.initData();
          }
        }
      ]
    });
    prompt.present();
  }

  clearStorage(){
    let prompt = this.alertCtrl.create({
      title: 'Clear DB',
      message: `This will delete all your saved data and settings. Are you sure?`,
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
            this.recipeProvider.clearData();
          }
        }
      ]
    });
    prompt.present();
  }
}
