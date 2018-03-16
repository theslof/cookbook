import { Injectable } from '@angular/core';
import {RECIPES} from "./mock-recipes";

@Injectable()
export class RecipesProvider {

  constructor() {}

  getRecipes() {
    return RECIPES;
  }

  saveRecipes(recipes) {
  }
}
