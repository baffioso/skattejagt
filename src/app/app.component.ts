import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { animations } from './animations';
import { StoreService } from './services/store.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: animations
})
export class AppComponent implements OnInit {

  store = inject(StoreService);

  treasureVisible = false;

  ngOnInit(): void {
      this.store.initStore();

      navigator.geolocation.getCurrentPosition(console.log)
  }
}
