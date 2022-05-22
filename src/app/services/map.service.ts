import { Injectable } from '@angular/core';
import { Map, GeolocateControl, Marker, LngLatLike, LngLatBoundsLike } from 'maplibre-gl';
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
      style: 'https://api.maptiler.com/maps/hybrid/style.json?key=tiNMCb9CgsMttr9UGj47',
      center: [12.5745, 55.6648],
      zoom: 15,
      attributionControl: false
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

    this.map.on('load', () => {

      this._mapLoaded$.next(true);

    })
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
    this.map.fitBounds(bounds as LngLatBoundsLike, { padding: 100 })
  }
}
