import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
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

  letter$: Observable<string>;
  lastTreasure$: Observable<boolean>;

  constructor(
    public store: StoreService
  ) { }

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
    confetti();
  }

  onNextTreasure(): void {
    this.store.nextTreasure();
  }

  onShowSummery(): void {
    this.store.toggleTreasure();
    this.store.toggleSummery();
  }

}
