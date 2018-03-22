import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {ItemPage} from "../pages/item/item";
import { RecipesProvider } from '../providers/recipes/recipes';
import {IonicStorageModule} from "@ionic/storage";
import {Vibration} from "@ionic-native/vibration";
import {NativeAudio} from "@ionic-native/native-audio";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ItemPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    ItemPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    RecipesProvider,
    Vibration,
    NativeAudio,
  ]
})
export class AppModule {}
