import { inject, Injectable } from '@angular/core';
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

  private localStorageService = inject(LocalStorageService)
  private geolocationService = inject(GeolocationService)
  private mapService = inject(MapService)

  private _routes$ = new BehaviorSubject<TreasureRoute[]>(treasureRoutes);
  routes$: Observable<TreasureRoute[]> = this._routes$.asObservable();

  private _selectedRoute$ = new BehaviorSubject<TreasureRoute | null>(null);
  selectedRoute$: Observable<TreasureRoute | null> = this._selectedRoute$.asObservable();

  private _treasureIndex$ = new BehaviorSubject<number>(0);
  treasureIndex$: Observable<number> = this._treasureIndex$.asObservable()

  private _showLanding$ = new BehaviorSubject<boolean>(true);
  showLanding$: Observable<boolean> = this._showLanding$.asObservable()

  private _showTreasure$ = new BehaviorSubject<boolean>(false);
  showTreasure$: Observable<boolean> = this._showTreasure$.asObservable();

  private _showSummery$ = new BehaviorSubject<boolean>(false);
  showSummery$: Observable<boolean> = this._showSummery$.asObservable();

  currentTreasure$ = combineLatest([
    this.selectedRoute$,
    this.treasureIndex$,
    this.mapService.mapLoaded$
  ]).pipe(
    filter(([route, , mapLoaded]) => mapLoaded && !!route),
    map(([route, index,]) => (route as TreasureRoute).treasures[index]),
    tap(treasure => this.mapService.addMarker(treasure.geometry.coordinates, 'treasure-map-icon'))
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
      if (distance < 20) {
        this._showTreasure$.next(true)
      }
    })
  );

  initStore(): void {
    this.localStorageService.get('route').pipe(
      filter(route => !!route),
      tap(route => {
        this._selectedRoute$.next(route);
        this._showLanding$.next(false);
      })
    ).subscribe()

    this.localStorageService.get('treasureIndex').pipe(
      filter(index => !!index),
      tap(index => {
        this._treasureIndex$.next(index);
      })
    ).subscribe()
  }

  nextTreasure(): void {
    if (this._treasureIndex$.value + 1 < (this._selectedRoute$.value?.treasures.length as number)) {
      this._treasureIndex$.next(this._treasureIndex$.value + 1)
      this.localStorageService.add('treasureIndex', this._treasureIndex$.value);
    }

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

  selectRoute(name: RouteNames): void {
    const route = this._routes$.value.find(route => route.name === name);

    if (route) {
      this._selectedRoute$.next(route as any);
      this.localStorageService.add('route', route);
    }
  }

  reset() {
    this._selectedRoute$.next(null);
    this._treasureIndex$.next(0);
    this._showLanding$.next(true);
    this.localStorageService.remove('route');
    this.localStorageService.remove('treasureIndex');
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

  zoomToTreasure(): void {

    combineLatest([
      this.geolocationService.position$,
      this.currentTreasure$,
      this.mapService.mapLoaded$
    ]).pipe(
      first(),
      filter(([, , mapLoaded]) => mapLoaded),
      tap(([position, treasure, ]) => {

        const userLocation = [position.coords.longitude, position.coords.latitude]

        this.mapService.zoomTo(userLocation, treasure.geometry.coordinates)
      })
    ).subscribe()
  }

}
