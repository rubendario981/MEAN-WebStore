import { Component, DoCheck, OnInit } from '@angular/core';
import { ComunicandoComponentesService } from './modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  // numFavs: number
  // numCart: number

  constructor(private comComponent: ComunicandoComponentesService){}

  ngOnInit(){
  }
  
  ngDoCheck(){    
  }
  
  // ngAfterContentChecked(){
    // this.numFavs = this.comComponent.enviandoFavs()
    // this.numCart = this.comComponent.enviandoCantCarrito()
  // }

}
