import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  showTopBar$: Observable<boolean> = combineLatest([
    this.store.distanceToTreasure$,
    this.store.showTreasure$,
    this.store.showSummery$
  ]).pipe(
    map(([dist, treasure, summery]) => !!dist && !treasure && !summery)
  )

  treasureNumber$ = this.store.treasureIndex$.pipe(
    map(index => index + 1)
  );

  constructor(
    private mapService: MapService,
    public store: StoreService,
  ) { }

  ngOnInit(): void {
    this.store.showSummery$.subscribe(console.log)
  }

  ngAfterViewInit(): void {
    this.mapService.initMap();
  }


}
