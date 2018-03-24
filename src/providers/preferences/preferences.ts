import { Injectable } from '@angular/core';
import {Storage} from "@ionic/storage";

/*
  Generated class for the PreferencesProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PreferencesProvider {
  private static readonly PREF_INITIALIZED = 'preferences_initialized';
  preferences = {};

  constructor(private storage: Storage) {
    this.initialize();
  }

  initialize(){
    this.storage.get(PreferencesProvider.PREF_INITIALIZED).then(response => {
      if(response == null || response == false){
        //Init all prefs locally and in storage
      } else {
        //Fetch all prefs from storage
      }
    });
  }
}
