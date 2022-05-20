import { Injectable } from '@angular/core';
import { Map, GeolocateControl } from 'maplibre-gl';
import { treasures } from 'src/assets/treasures';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  map: Map;

  constructor() { }

  initMap(): void {
    this.map = new Map({
      container: 'map',
      style: 'https://api.maptiler.com/maps/hybrid/style.json?key=tiNMCb9CgsMttr9UGj47',
      center: [12.5745, 55.6648],
      zoom: 15
    })

    this.map.addControl(
      new GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true
      })
    );

    this.map.on('load', () => {

      this.map.addSource(
        'treasures',
        {
          type: 'geojson',
          data: treasures
        }
      );

      this.map.addLayer({
        id: 'treasures',
        source: 'treasures',
        type: 'circle',
        paint: {
          "circle-color": 'red',
          "circle-radius": 10
        }
      });

    })
  }
}
