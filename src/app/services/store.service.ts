import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Feature } from 'geojson';
import { treasures } from 'src/assets/treasures';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _treasures$ = new BehaviorSubject<Feature[]>(treasures.features);
  treasures$: Observable<Feature[]> = this._treasures$.asObservable();

  nextTreasure = this.treasures$

  constructor() { }
}
