import { AfterViewInit, ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
// import confetti from 'canvas-confetti';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-treasure',
  templateUrl: './treasure.component.html',
  styleUrls: ['./treasure.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreasureComponent implements OnInit, AfterViewInit {

  letter$: Observable<string>;

  constructor(
    private store: StoreService
  ) { }

  ngOnInit(): void {
    this.letter$ = this.store.currentTreasure$.pipe(
      map(treasure => (treasure.properties as any).bogstav)
    )
  }

  ngAfterViewInit(): void {
      // confetti();
  }

  onNextTreasure(): void {
    this.store.nextTreasure();
  }

}
