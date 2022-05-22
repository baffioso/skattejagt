import { Injectable } from '@angular/core';
import { Observable } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {


  position$: Observable<GeolocationPosition> = new Observable((observer) => {
    let watchId: number;

    if ('geolocation' in navigator) {
      watchId = navigator.geolocation.watchPosition(
        (position: GeolocationPosition) => observer.next(position),
        (error: GeolocationPositionError) => observer.error(error),
        {
          enableHighAccuracy: true,
          maximumAge: 2000
        }
      );
      console.log('LOCATION')
    } else {
      observer.error('Geolocation not available');
    }

    return {
      unsubscribe() {
        navigator.geolocation.clearWatch(watchId);
      }
    }
  })

  constructor() { }

}
