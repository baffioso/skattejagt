import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { StoreService } from './services/store.service';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger(
      'inOutAnimation',
      [
        transition(
          ':enter',
          [
            //style({ height: 0, opacity: 0 }),
            animate('500ms ease-out',
            style({ height: 300, opacity: 1 }))
          ]
        ),
        transition(
          ':leave',
          [
            //style({ height: 300, opacity: 1 }),
            animate('500ms ease-in',
            style({ height: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class AppComponent implements OnInit {
  treasureVisible = false;

  constructor(
    public store: StoreService
  ) { }

  ngOnInit(): void {
      this.store.initStore();
  }
}
