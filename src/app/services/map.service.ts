import { inject, Injectable } from '@angular/core';
import { Map, GeolocateControl, ScaleControl, Marker, LngLatLike, LngLatBoundsLike } from 'maplibre-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import bbox from '@turf/bbox';
import { GeolocationService } from './geolocation.service';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  locationService = inject(GeolocationService)

  map: Map;
  userMarker: Marker;
  treasureMarker: Marker;

  private _mapLoaded$ = new BehaviorSubject<boolean>(false);
  mapLoaded$: Observable<boolean> = this._mapLoaded$.asObservable();

  initMap(): void {
    this.map = new Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/6f058849-8a79-455e-ae2f-817a7ec72312/style.json?key=tiNMCb9CgsMttr9UGj47',
      center: [12.5745, 55.6648],
      zoom: 15,
      attributionControl: false
    })

    this.map.touchZoomRotate.disableRotation();
    this.map.dragRotate.disable();

    this.map.addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showAccuracyCircle: false,
        showUserLocation: false
      }),
      'bottom-right'
    );

    this.map.addControl(
      new ScaleControl({
        maxWidth: 200,
        unit: 'metric'
      })
    );

    this.map.on('load', () => {

      this.map.resize()
      this._mapLoaded$.next(true);

      this.map.addSource('orto', {
        "type": "raster",
        "tiles": [
          "https://services.datafordeler.dk/GeoDanmarkOrto/orto_foraar/1.0.0/WMS?username=DTMMBNXGMB&password=LvA$*001&VERSION=1.1.1&REQUEST=GetMap&BBOX={bbox-epsg-3857}&SRS=EPSG:3857&WIDTH=256&HEIGHT=256&LAYERS=orto_foraar&STYLES=&FORMAT=image/jpeg"
        ],
        "tileSize": 256
      });

      this.map.addLayer({
        "id": "orto",
        "type": "raster",
        "source": "orto",
        "paint": {
          "raster-opacity": [
            "interpolate",
            [
              "linear"
            ],
            [
              "zoom"
            ],
            15,
            0,
            16,
            1
          ]
        },
        "layout": {
          "visibility": "visible"
        },
        "minzoom": 14
      }, 'label_road');

      this.locationService.position$.pipe(
        tap(location => {
          const userLocation = [location.coords.longitude, location.coords.latitude]

          const el = document.createElement('div');
          el.className = 'pirate-map-icon';

          if (this.userMarker) {
            this.userMarker.remove();
          }

          this.userMarker = new Marker(el, {anchor: 'bottom'})
            .setLngLat(userLocation as LngLatLike)
            .addTo(this.map);
        })
      ).subscribe()

    });
  }

  addMarker(coords: number[], icon: 'treasure-map-icon' | 'pirate-map-icon'): void {

    const el = document.createElement('div');
    el.className = icon;

    if (this.treasureMarker) {
      this.removeMarker();
    }

    this.treasureMarker = new Marker(el)
      .setLngLat(coords as LngLatLike)
      .addTo(this.map);
  }

  removeMarker(): void {
    this.treasureMarker.remove();
  }

  zoomTo(position: number[], treasure: number[]) {
    const bounds = bbox({
      type: 'LineString',
      coordinates: [position, treasure]
    });
    this.map.fitBounds(bounds as LngLatBoundsLike, { padding: 30 })
  }
}
