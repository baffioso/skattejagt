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
