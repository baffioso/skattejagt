import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, first, map, tap, switchMap } from 'rxjs/operators';
import { Feature, GeoJsonProperties } from 'geojson';
import distance from '@turf/distance';
import { Point } from 'geojson'

import { treasures } from 'src/assets/treasures';
import { LocalStorageService } from './local-storage.service';
import { GeolocationService } from './geolocation.service';
import { MapService } from './map.service';
import { TreasureProperties } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  private shuffledTreasures: Feature<Point, TreasureProperties>[] = treasures.features
    .map(feature => ({ feature, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ feature }) => feature)
  //.slice(0, 2)

  private _treasures$ = new BehaviorSubject<Feature<Point, TreasureProperties>[]>(this.shuffledTreasures)
  treasures$: Observable<Feature<Point, TreasureProperties>[]> = this._treasures$.asObservable()
    .pipe(
      switchMap(() => this.localStorageService.get('treasures')),
      filter((treasures: any) => !!treasures),
      map((treasures: Feature<Point, TreasureProperties>[]) => treasures)
    );

  private _treasureIndex$ = new BehaviorSubject<number>(0);
  treasureIndex$: Observable<number> = this._treasureIndex$.asObservable()
  // .pipe(
  //   switchMap(() => this.localStorageService.get('treasureIndex')),
  //   filter((index: any) => !!index),
  //   map((index: number) => index),
  //   tap(console.log)
  // );

  private _showTreasure$ = new BehaviorSubject<boolean>(false);
  showTreasure$: Observable<boolean> = this._showTreasure$.asObservable();

  private _showSummery$ = new BehaviorSubject<boolean>(true);
  showSummery$: Observable<boolean> = this._showSummery$.asObservable();

  currentTreasure$ = combineLatest([
    this.treasures$,
    this.treasureIndex$,
    this.mapService.mapLoaded$
  ]).pipe(
    filter(([, , mapLoaded]) => mapLoaded),
    map(([treasues, index,]) => treasues[index]),
    tap(treasure => this.mapService.addMarker(treasure.geometry.coordinates))
  )

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
  )

  // showSummery$: Observable<boolean> = combineLatest([
  //   this.treasures$,
  //   this.treasureIndex$
  // ]).pipe(
  //   map(([treasures, index]) => treasures.length - 1 === index)
  // )

  constructor(
    private localStorageService: LocalStorageService,
    private geolocationService: GeolocationService,
    private mapService: MapService

  ) {
    this.localStorageService.add('treasures', this._treasures$.value)
  }

  nextTreasure(): void {
    if (this._treasureIndex$.value + 1 < this._treasures$.value.length) {
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

  toggleTreasure(): void {
    this._showTreasure$.next(!this._showTreasure$.value);
  }

  toggleSummery(): void {
    this._showSummery$.next(!this._showSummery$.value);
  }

}
