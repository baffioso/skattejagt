import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-summery',
  templateUrl: './summery.component.html',
  styleUrls: ['./summery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummeryComponent implements OnInit {

  store = inject(StoreService)

  ngOnInit(): void {
  }

  onCloseSummery(): void {
    this.store.toggleSummery();
  }

  onPlayAgain(): void {
    this.store.reset();
    this.store.toggleSummery();
  }

}
