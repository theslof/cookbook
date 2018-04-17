import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {RECIPES} from "./mock-recipes";
import {Observable} from "rxjs/Observable";
import {UUID} from "angular2-uuid";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

@Injectable()
export class RecipesProvider {
  private static readonly STORAGE_INDEX = 'index';
  private static readonly STORAGE_FAVORITES = 'favorites';
  private recipe: BehaviorSubject<RecipeIndex>;
  private favoritesSubject: BehaviorSubject<RecipeIndex>;
  private favorites: RecipeIndex;
  private index: RecipeIndex;

  constructor(private storage: Storage) {
    this.recipe = new BehaviorSubject<RecipeIndex>({});
    this.favoritesSubject = new BehaviorSubject<RecipeIndex>({});

    this.recipe.subscribe((value: RecipeIndex) => {
      this.index = value;
    });

    this.favoritesSubject.subscribe((value: RecipeIndex) => {
      this.favorites = value;
    });

    this.storage.get(RecipesProvider.STORAGE_INDEX).then((data: RecipeIndex) => {
      this.updateRecipes(data == null ? {} : data);
    });

    this.storage.get(RecipesProvider.STORAGE_FAVORITES).then((favorites: RecipeIndex) => {
      this.favoritesSubject.next(favorites == null ? {} : favorites);
    });
  }

  private updateRecipes(data: RecipeIndex) {
    this.recipe.next(data);
  }

  getRecipes(): Observable<RecipeIndex> {
    return this.recipe;
  }

  getFavorites(): Observable<RecipeIndex> {
    return this.favoritesSubject;
  }

  getRecipe(uuid: string): Promise<Recipe> {
    return this.storage.get(uuid);
  }

  addFavorite(uuid: string) {
    if (this.index[uuid] != null) {
      this.favorites[uuid] = this.index[uuid];
      this.storage.set(RecipesProvider.STORAGE_FAVORITES, this.favorites);
      this.favoritesSubject.next(this.favorites);
    }
  }

  removeFavorite(uuid: string) {
    if (this.favorites[uuid] != null) {
      delete this.favorites[uuid];
      this.storage.set(RecipesProvider.STORAGE_FAVORITES, this.favorites);
      this.favoritesSubject.next(this.favorites);
    }
  }

  isFavorite(uuid: string): boolean {
    return this.favorites[uuid] != null;
  }

  private saveRecipeIndex(recipes: RecipeIndex): Promise<RecipeIndex> {
    return this.storage.set(RecipesProvider.STORAGE_INDEX, recipes);
  }

  saveRecipe(uuid: string, recipe: Recipe): Promise<any> {
    return this.storage.set(uuid, recipe)
      .then(() => {
        this.index[uuid] = recipe.name;
        return this.saveRecipeIndex(this.index);
      })
      .then(() => {
        return this.updateRecipes(this.index);
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
    this.storage.remove(uuid)
      .then(() => {
        delete this.index[uuid];
        return this.saveRecipeIndex(this.index);
      })
      .then(() => {
        this.updateRecipes(this.index);
      })
  }

  static emptyRecipe(): Recipe {
    return {
      name: "",
      estTime: 0,
      ingredients: [],
      steps: [],
      timers: [],
      imageUrl: ""
    }
  }

  initData(): void {
    this.clearData()
      .then(() => {
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
  }

  clearData(): Promise<any> {
    this.recipe.next({});
    this.favoritesSubject.next({});
    return this.storage.clear();
  }

  static importRecipe(json: string): Recipe{
    let recipe = null;
    try {
      recipe = JSON.parse(json) as Recipe;
    } catch (e) {
      console.log(e);
      recipe = null;
    }

    return recipe;
  }

  static toEmail(recipe: Recipe): string{
    let body: string = '';
    body += `${recipe.name}\n\n`;
    body += `Estimated time: ${recipe.estTime}m\n\n`;

    body += `-- Ingredients --\n`;
    recipe.ingredients.forEach((value:string, index:number, array:string[]) => {
      body += `* ${value}\n`;
    });
    body += `\n\n`;

    body += `-- Directions --\n`;
    recipe.steps.forEach((value:string, index:number, array:string[]) => {
      body += `* ${value}\n`;
    });
    body += `\n\n`;

    body += `-- JSON code begins --\n${JSON.stringify(recipe)}\n-- JSON code ends --`;
    return body;
  }
}

export interface RecipeIndex {
  [uuid: string]: string
}

export interface Recipe {
  name: string,
  estTime: number,
  ingredients: Array<string>,
  steps: Array<string>,
  timers: Array<number>,
  imageUrl: string
}
