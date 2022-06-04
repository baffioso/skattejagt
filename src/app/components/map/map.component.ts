import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  mapService = inject(MapService);

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
  }

  onReset() {
    if(confirm('Er du sikker på du vil nulstille?')) {
      this.store.reset();
    }
  }

}
