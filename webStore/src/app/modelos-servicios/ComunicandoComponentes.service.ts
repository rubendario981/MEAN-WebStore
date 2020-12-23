import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComunicandoComponentesService {

  cantidadFavoritos: number
  cantidadCarrito: number
  
  mensajeroFavs(numFavs: number){
    // console.log('recibiendo fav ' + numFavs)
    return this.cantidadFavoritos = numFavs
  }
  
  enviandoFavs(): number{
    // console.log('enviando fav ' + this.cantidadFavoritos)
    if(!isNaN(this.cantidadFavoritos)){
      return this.cantidadFavoritos
    }
  }

  mensajeroCarrito(numCarrito: number){
    // console.log('serv msj carrito ' + numCarrito)
    return this.cantidadCarrito = numCarrito
  }

  enviandoCantCarrito(): number{
    if(!isNaN(this.cantidadFavoritos)){
      // console.log('env num carrito ' + this.cantidadCarrito)
      return this.cantidadCarrito
    }
  }

}
