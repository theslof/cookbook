import {Injectable} from '@angular/core';
import {Storage} from "@ionic/storage";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {Observable} from "rxjs/Observable";

@Injectable()
export class PreferencesProvider {
  private static readonly PREF_INITIALIZED = 'preferences_initialized';
  private static readonly PREF_THEME = 'preferences_theme';
  private static readonly PREF_THEME_DEFAULT = 'theme-default';
  private preferences = {};
  private theme: BehaviorSubject<string>;

  constructor(private storage: Storage) {
    this.theme = new BehaviorSubject<string>(PreferencesProvider.PREF_THEME_DEFAULT);
    this.initialize();
  }

  initialize() {
    this.storage.get(PreferencesProvider.PREF_INITIALIZED).then(response => {
      if (response == null || response == false) {
        //Init all prefs locally
        this.preferences[PreferencesProvider.PREF_THEME] = PreferencesProvider.PREF_THEME_DEFAULT;

        //Init all prefs in storage
        this.storage.set(PreferencesProvider.PREF_THEME, PreferencesProvider.PREF_THEME_DEFAULT)
          .then(() => {
            this.storage.set(PreferencesProvider.PREF_INITIALIZED, true);
          });
      } else {
        //Fetch all prefs from storage
        this.storage.get(PreferencesProvider.PREF_THEME)
          .then((value: string) => {
            this.theme.next(value);
          });
      }
    });
  }

  getPreference(key: string): string {
    return this.preferences[key];
  }

  setPreference(key: string, value: string): void {
    this.preferences[key] = value;
    this.storage.set(key, value);
  }

  getTheme(): Observable<string> {
    return this.theme;
  }

  setTheme(theme: string): void {
    this.theme.next(theme);
    this.setPreference(PreferencesProvider.PREF_THEME, theme);
  }
}
