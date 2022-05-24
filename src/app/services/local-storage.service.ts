import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  private _localStorage$ = new BehaviorSubject<{[key: string]: string} | null>(null);
  localStorage$: Observable<{[key: string]: string} | null> = this._localStorage$.asObservable();

  constructor() { }

  add(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string): Observable<string | null> {
    return of(localStorage.getItem(key))
  }



}
