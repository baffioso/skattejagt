import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreService } from 'src/app/services/store.service';

@Component({
  selector: 'app-summery',
  templateUrl: './summery.component.html',
  styleUrls: ['./summery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SummeryComponent implements OnInit {

  constructor(
    public store: StoreService
  ) { }

  ngOnInit(): void {
  }

  onCloseSummery(): void {
    this.store.toggleSummery();
  }

}
