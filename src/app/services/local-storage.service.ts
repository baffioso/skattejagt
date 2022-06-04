import { Injectable } from '@angular/core';
import { Feature, Point } from 'geojson';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { TreasureProperties, TreasureRoute } from '../interfaces';

type keys = 'route' | 'treasureIndex';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private _localStorage$ = new BehaviorSubject<{[key: string]: string} | null>(null);
  localStorage$: Observable<{[key: string]: string} | null> = this._localStorage$.asObservable();

  add(key: keys, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: keys): Observable<any> {
    const storage = localStorage.getItem(key)

    if (storage) {
      return of(JSON.parse(storage));
    }

    return of(null);
  }

  remove(key: keys) {
    localStorage.removeItem(key);
  }



}
