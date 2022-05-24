import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HelpComponent } from './components/help/help.component';
import { TreasureComponent } from './components/treasure/treasure.component';
import { MapComponent } from './components/map/map.component';
import { SummeryComponent } from './components/summery/summery.component';

@NgModule({
  declarations: [
    AppComponent,
    HelpComponent,
    TreasureComponent,
    MapComponent,
    SummeryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
