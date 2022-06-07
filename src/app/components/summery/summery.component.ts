import { AfterViewInit, ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';
import {treasureRoutes} from 'src/assets/treasures';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-summery',
  templateUrl: './summery.component.html',
  styleUrls: ['./summery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummeryComponent implements AfterViewInit {

  store = inject(StoreService)
  colors = [
    ...treasureRoutes.map(route => route.color),
    ...treasureRoutes.map(route => route.color)
  ];

  ngAfterViewInit(): void {
    confetti({
      particleCount: 1000,
      spread: 360
    })

    const audio = new Audio('assets/tada.mp3')
    audio.play();
  }

  onPlayAgain(): void {
    this.store.reset();
  }
}
