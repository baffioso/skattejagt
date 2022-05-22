import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
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

  // currentTreasure$: Observable<Feature<Point>>
  distanceToTreasure$: Observable<number>;

  constructor(
    private mapService: MapService,
    private store: StoreService,
  ) { }

  ngOnInit(): void {
    // this.currentPosistion$ = this.geolocationService.position$.pipe(
    //   map(position => position.coords)
    // )

    this.distanceToTreasure$ = this.store.distanceToTreasure$

  }

  ngAfterViewInit(): void {
    this.mapService.initMap();

    // this.store.treasureIndex$.subscribe(console.log);
    // this.geolocationService.watchPosistion();
    // this.pos = this.geolocationService.position$.pipe(
    //   map((position: any) => position.coords),
    //   tap(console.log)
    // ).subscribe()
  }


}
