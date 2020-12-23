import { Component, DoCheck, OnInit } from '@angular/core';
import { ComunicandoComponentesService } from './modelos-servicios/ComunicandoComponentes.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, DoCheck {
  numFavs: number
  numCart: number

  constructor(private comComponent: ComunicandoComponentesService){}

  ngOnInit(){
  }
  
  ngDoCheck(){
    //validando cambios en la cantidad de favoritos
    if(this.comComponent.enviandoFavs()){
      this.numFavs = this.comComponent.enviandoFavs()
    }
    //validando cambios en la cantidad del carrito 
    if(this.comComponent.enviandoCantCarrito()){
      this.numCart = this.comComponent.enviandoCantCarrito()
    }
  }

}
