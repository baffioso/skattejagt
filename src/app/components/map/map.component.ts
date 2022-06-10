import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GeolocationService } from 'src/app/services/geolocation.service';
import { MapService } from 'src/app/services/map.service';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapComponent implements AfterViewInit {

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

  ngAfterViewInit(): void {
    this.mapService.initMap();
  }

  onReset() {
    if(confirm('Er du sikker på du vil nulstille spillet?')) {
      this.store.reset();
    }
  }

}
