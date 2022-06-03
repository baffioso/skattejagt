import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, first, map, tap, switchMap, pluck, withLatestFrom } from 'rxjs/operators';
import distance from '@turf/distance';

import { treasureRoutes } from 'src/assets/treasures';
import { LocalStorageService } from './local-storage.service';
import { GeolocationService } from './geolocation.service';
import { MapService } from './map.service';
import { RouteNames, TreasureRoute } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private _routes$ = new BehaviorSubject<TreasureRoute[]>(treasureRoutes);
  routes$: Observable<TreasureRoute[]> = this._routes$.asObservable();

  private _selectedRoute$ = new BehaviorSubject<TreasureRoute | null>(null);
  selectedRoute$: Observable<TreasureRoute | null> = this._selectedRoute$.asObservable();

  private _treasureIndex$ = new BehaviorSubject<number>(0);
  treasureIndex$: Observable<number> = this._treasureIndex$.asObservable()
  // .pipe(
  //   switchMap(() => this.localStorageService.get('treasureIndex')),
  //   filter((index: any) => !!index),
  //   map((index: number) => index),
  //   tap(console.log)
  // );

  private _showLanding$ = new BehaviorSubject<boolean>(true);
  showLanding$: Observable<boolean> = this._showLanding$.asObservable()

  private _showTreasure$ = new BehaviorSubject<boolean>(false);
  showTreasure$: Observable<boolean> = this._showTreasure$.asObservable();

  private _showSummery$ = new BehaviorSubject<boolean>(true);
  showSummery$: Observable<boolean> = this._showSummery$.asObservable();

  currentTreasure$ = combineLatest([
    this.selectedRoute$,
    this.treasureIndex$,
    this.mapService.mapLoaded$
  ]).pipe(
    filter(([route, , mapLoaded]) => mapLoaded && !!route),
    map(([route, index,]) => (route as TreasureRoute).treasures[index]),
    tap(treasure => this.mapService.addMarker(treasure.geometry.coordinates))
  );

  distanceToTreasure$: Observable<number> = combineLatest([
    this.geolocationService.position$,
    this.currentTreasure$
  ]).pipe(
    map(([location, treasure]) => {

      const userLocation = [location.coords.longitude, location.coords.latitude]

      return Math.round(distance(userLocation, treasure.geometry.coordinates) * 1000)
    }),
    tap(distance => {
      if (distance < 3000) {
        this._showTreasure$.next(true)
      }
    })
  );

  constructor(
    private localStorageService: LocalStorageService,
    private geolocationService: GeolocationService,
    private mapService: MapService
  ) {
    this.localStorageService.get('route').pipe(
      filter(route => !!route),
      tap(route => {
        this._selectedRoute$.next(route);
        this._showLanding$.next(false);
      })
    ).subscribe()

  }

  nextTreasure(): void {
    if (this._treasureIndex$.value + 1 < (this._selectedRoute$.value?.treasures.length as number)) {
      this._treasureIndex$.next(this._treasureIndex$.value + 1)
      this.localStorageService.add('treasureIndex', this._treasureIndex$.value);
    }

    this._showTreasure$.next(false);

    combineLatest([
      this.geolocationService.position$,
      this.currentTreasure$
    ]).pipe(
      first(),
      tap(([position, treasure]) => {

        const userLocation = [position.coords.longitude, position.coords.latitude]

        this.mapService.zoomTo(userLocation, treasure.geometry.coordinates)
      })
    ).subscribe()
  }

  selectTreasureRoute(name: RouteNames): void {
    const route = this._routes$.value.find(route => route.name = name);

    if (route) {
      this._selectedRoute$.next(route);
      this.localStorageService.add('route', route);
    }
  }

  toggleLanding(): void {
    this._showLanding$.next(!this._showLanding$.value);
  }

  toggleTreasure(): void {
    this._showTreasure$.next(!this._showTreasure$.value);
  }

  toggleSummery(): void {
    this._showSummery$.next(!this._showSummery$.value);
  }

}
