import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {RECIPES} from "./mock-recipes";
import {Observable} from "rxjs/Observable";
import {UUID} from "angular2-uuid";

@Injectable()
export class RecipesProvider {
  private static readonly STORAGE_INDEX = 'index';
  private recipeObserver: any;
  private recipeObservable: Observable<RecipeIndex>;
  private index: RecipeIndex = {};

  constructor(private storage: Storage) {
    this.recipeObservable = Observable.create(observer => {
      this.recipeObserver = observer;
    });
    this.storage.get(RecipesProvider.STORAGE_INDEX).then((data: RecipeIndex) => {
      this.index = data == null ? {} : data;
      this.updateRecipes(data);
    });
  }

  private updateRecipes(data: RecipeIndex) {
    this.recipeObserver.next(data);
  }

  getRecipes(): Observable<RecipeIndex> {
    return this.recipeObservable;
  }

  getIndex(): RecipeIndex {
    return this.index;
  }

  getRecipe(uuid: string): Promise<Recipe> {
    return this.storage.get(uuid);
  }

  private saveRecipeIndex(recipes: RecipeIndex): Promise<RecipeIndex> {
    return this.storage.set(RecipesProvider.STORAGE_INDEX, recipes);
  }

  saveRecipe(uuid: string, recipe: Recipe): void {
    this.storage.set(uuid, recipe)
      .then(value => {
        this.index[uuid] = recipe.name;
        return this.saveRecipeIndex(this.index);
      })
      .then(value => {
        this.updateRecipes(this.index);
      });
  }

  changeRecipeName(uuid: string, name: string) {
    this.index[uuid] = name;
    this.saveRecipeIndex(this.index)
      .then((i: RecipeIndex) => {
        this.updateRecipes(i);
        return this.storage.get(uuid);
      })
      .then((recipe: Recipe) => {
        recipe.name = name;
        this.storage.set(uuid, recipe);
      });
  }

  deleteRecipe(uuid: string) {
    this.storage.remove(uuid).then(value => {
      delete this.index[uuid];
      this.updateRecipes(this.index);
    })
  }

  static emptyRecipe(): Recipe {
    return {
      name: "",
      ingredients: [],
      steps: [],
      timers: [],
      imageUrl: ""
    }
  }

  initData(): void {
    this.storage.clear()
      .then(value => {
        this.index = {};
        RECIPES.forEach((value: Recipe) => {
          let uuid: string = UUID.UUID();
          this.index[uuid] = value.name;
          this.storage.set(uuid, value);
        });
        return this.storage.set(RecipesProvider.STORAGE_INDEX, this.index);
      })
      .then((recipes: RecipeIndex) => {
        this.updateRecipes(recipes);
      });
    ;
  }
}

export interface RecipeIndex {
  [uuid: string]: string
}

export interface Recipe {
  name: string,
  ingredients: Array<{
    quantity: string,
    name: string,
  }>,
  steps: Array<string>,
  timers: Array<number>,
  imageUrl: string
}
