import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {RECIPES} from "./mock-recipes";

@Injectable()
export class RecipesProvider {
  private static readonly STORAGE_KEY = 'cookbook';

  constructor(private storage: Storage) {
  }

  getRecipes(): Promise<Recipe[]> {
    return this.storage.get(RecipesProvider.STORAGE_KEY);
  }

  saveRecipes(recipes: Recipe[]): Promise<Recipe[]> {
    return this.storage.set(RecipesProvider.STORAGE_KEY, recipes);
  }

  saveRecipe(recipe: Recipe): Promise<Recipe[]> {
    return this.storage.get(RecipesProvider.STORAGE_KEY)
      .then((recipes: Recipe[]) => {
        if (recipe.index >= 0) {
          recipes[recipe.index] = recipe;
          return this.storage.set(RecipesProvider.STORAGE_KEY, recipes);
        } else {
          return recipes;
        }
      });
  }

  static emptyRecipe(): Recipe{
    return {
      index: -1,
      name: "",
      removed: false,
      ingredients: [],
      steps: [],
      timers: [],
      imageUrl: ""
    }
  }

  initData(): Promise<Recipe[]> {
    return this.storage.set(RecipesProvider.STORAGE_KEY, RECIPES);
  }
}

export interface Recipe {
  index: number,
  name: string,
  removed: boolean,
  ingredients: Array<{
    quantity: string,
    name: string,
  }>,
  steps: Array<string>,
  timers: Array<number>,
  imageUrl: string
}
