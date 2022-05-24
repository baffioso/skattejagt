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

  distanceToTreasure$: Observable<number>;

  constructor(
    private mapService: MapService,
    private store: StoreService,
  ) { }

  ngOnInit(): void {
    this.distanceToTreasure$ = this.store.distanceToTreasure$
    this.store.showSummery$.subscribe(console.log)
  }

  ngAfterViewInit(): void {
    this.mapService.initMap();
  }


}
