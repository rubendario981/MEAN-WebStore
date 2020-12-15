import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges, OnInit } from '@angular/core';
import { ComunicandoComponentesService } from './modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements DoCheck {
  numFavs: number

  constructor(private comComponent: ComunicandoComponentesService){}

  ngDoCheck(){
    if(this.comComponent.recibiendoFavoritos){
      this.numFavs = this.comComponent.recibiendoFavoritos
    }
  }
}
