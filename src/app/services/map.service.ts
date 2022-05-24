import { Injectable } from '@angular/core';
import { Map, GeolocateControl, ScaleControl, Marker, LngLatLike, LngLatBoundsLike } from 'maplibre-gl';
import { BehaviorSubject, Observable } from 'rxjs';
import bbox from '@turf/bbox';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: Map;
  marker: Marker;

  private _mapLoaded$ = new BehaviorSubject<boolean>(false);
  mapLoaded$: Observable<boolean> = this._mapLoaded$.asObservable();

  constructor() { }

  initMap(): void {
    this.map = new Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/6f058849-8a79-455e-ae2f-817a7ec72312/style.json?key=tiNMCb9CgsMttr9UGj47',
      center: [12.5745, 55.6648],
      zoom: 15,
      attributionControl: false,
      hash: true
    })

    this.map.addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      }),
      'bottom-right'
    );

    const scale = new ScaleControl({
      maxWidth: 200,
      unit: 'metric'
    });

    this.map.addControl(scale);

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
            16,
            0,
            18,
            1
          ]
        },
        "layout": {
          "visibility": "visible"
        },
        "minzoom": 15
      }, 'label_road');

    });
  }

  addMarker(coords: number[]): void {

    const el = document.createElement('div');
    el.className = 'treasure-map-icon';

    if (this.marker) {
      this.removeMarker();
    }

    this.marker = new Marker()
      .setLngLat(coords as LngLatLike)
      .addTo(this.map);
  }

  removeMarker(): void {
    this.marker.remove();
  }

  zoomTo(position: number[], treasure: number[]) {
    const bounds = bbox({
      type: 'LineString',
      coordinates: [position, treasure]
    });
    this.map.fitBounds(bounds as LngLatBoundsLike, { padding: 30 })
  }
}
