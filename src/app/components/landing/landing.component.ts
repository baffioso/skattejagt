import { Component, inject } from '@angular/core';
import { RouteNames } from 'src/app/interfaces';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent {

  store = inject(StoreService);

  constructor(
    // public store: StoreService
  ) { }

  onSelectRoute(route: RouteNames): void {
    this.store.selectRoute(route);
    this.store.toggleLanding();
  }

}
