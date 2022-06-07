import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import confetti from 'canvas-confetti';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreasureComponent implements OnInit, AfterViewInit {

  store = inject(StoreService)

  letter$: Observable<string>;
  lastTreasure$: Observable<boolean>;

  ngOnInit(): void {
    this.letter$ = this.store.currentTreasure$.pipe(
      map(treasure => (treasure.properties as any).bogstav)
    )

    this.lastTreasure$ = combineLatest([
      this.store.selectedRoute$,
      this.store.treasureIndex$
    ]).pipe(
      map(([treasures, index]) => (treasures?.treasures as any).length - 1 === index)
    )
  }

  ngAfterViewInit(): void {

    const audio = new Audio('assets/tada.mp3')
    audio.play();

    setTimeout(() => {
      confetti({
        particleCount: 1000,
        spread: 360
      })
    }, 2500);
  }

  onNextTreasure(): void {
    this.store.nextTreasure();
    this.store.toggleTreasure();
  }

  onShowSummery(): void {
    this.store.toggleSummery();
    this.store.toggleTreasure();
  }

}
