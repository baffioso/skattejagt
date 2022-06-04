import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap, first, filter } from 'rxjs/operators';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { MapService } from 'src/app/services/map.service';
import { StoreService } from 'src/app/services/store.service';
import { Feature, Point } from 'geojson'

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements OnInit, AfterViewInit {

  store = inject(StoreService);
  private mapService = inject(MapService);
  private geolocationService = inject(GeolocationService);

  showTopBar$: Observable<boolean> = combineLatest([
    this.store.distanceToTreasure$,
    this.store.showTreasure$,
    this.store.showSummery$,
    this.store.showLanding$
  ]).pipe(
    map(([dist, treasure, summery, landing]) => !!dist && !treasure && !summery && !landing)
  )

  treasureNumber$ = this.store.treasureIndex$.pipe(
    map(index => index + 1)
  );

  ngOnInit(): void {
    this.store.showSummery$.subscribe(console.log)
  }

  ngAfterViewInit(): void {
    this.mapService.initMap();

    combineLatest([
      this.geolocationService.position$,
      this.store.currentTreasure$,
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

  onReset() {
    if(confirm('Er du sikker på du vil nulstille?')) {
      this.store.reset();
    }
  }

}
