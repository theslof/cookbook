import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {RECIPES} from "./mock-recipes";
import {Observable} from "rxjs/Observable";

@Injectable()
export class RecipesProvider {
  private static readonly STORAGE_KEY = 'cookbook';
  private recipeObserver: any;
  private recipes: Observable<Recipe[]>;

  constructor(private storage: Storage) {
    this.recipes = Observable.create(observer => {
      this.recipeObserver = observer;
    });
    this.storage.get(RecipesProvider.STORAGE_KEY).then((data: Recipe[]) => {
      this.updateRecipes(data);
    });
  }

  private updateRecipes(data: Recipe[]) {
    this.recipeObserver.next(data.filter((element: Recipe, index: number, array: Recipe[]) => {
      return !element.removed;
    }));
  }

  getRecipes(): Observable<Recipe[]> {
    return this.recipes;
  }

  private saveRecipes(recipes: Recipe[]): Promise<Recipe[]> {
    return this.storage.set(RecipesProvider.STORAGE_KEY, recipes);
  }

  saveRecipe(recipe: Recipe): void {
    this.storage.get(RecipesProvider.STORAGE_KEY)
      .then((recipes: Recipe[]) => {
        if (recipe.index >= 0) {
          recipes[recipe.index] = recipe;
        } else {
          recipe.index = recipes.length;
          recipes.push(recipe);
        }
        return this.saveRecipes(recipes);
      })
      .then((recipes: Recipe[]) => {
        this.updateRecipes(recipes);
      });
  }

  static emptyRecipe(): Recipe {
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

  initData(): void {
    this.storage.set(RecipesProvider.STORAGE_KEY, RECIPES)
      .then((recipes: Recipe[]) => {
        this.updateRecipes(recipes);
      });
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
