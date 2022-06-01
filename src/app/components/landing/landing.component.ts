import { Component, OnInit } from '@angular/core';
import { RouteViewModel } from 'src/app/interfaces';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  routes: RouteViewModel[] = [
    {
      name: 'Jack Sparrow',
      color: 'ef476f',
      route: 'test'
    },
    {
      name: 'Kaptajn Klo',
      color: 'ffd166',
      route: 'test'
    },
    {
      name: 'Sortskæg',
      color: '118ab2',
      route: 'test'
    },
    {
      name: 'Graystoke',
      color: '073b4c',
      route: 'test'
    },
    {
      name: 'Knud Rasmussen',
      color: '22333b',
      route: 'test'
    },
    {
      name: 'Napoleon',
      color: '3d348b',
      route: 'test'
    },
    {
      name: 'Kaptajn Haddock',
      color: 'c6ac8f',
      route: 'test'
    },
    {
      name: 'Kaptajn Skæg',
      color: '5e503f',
      route: 'test'
    }
  ]

  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
  }

  onSelectRoute(route: string): void {
    console.log(route);
    this.store.toggleLanding();
  }

}
