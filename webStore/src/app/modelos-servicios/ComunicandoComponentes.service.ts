import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ComunicandoComponentesService {

  cantidadFavoritos: number
  cantidadCarrito: number
  categorias: any

  receivedCategories(categorias){
    return this.categorias = categorias
  }

  sendCategories(){
    return this.categorias
  }
  
  mensajeroFavs(numFavs: number){
    return this.cantidadFavoritos = numFavs
  }
  
  enviandoFavs(): number{
    if(!isNaN(this.cantidadFavoritos)){
      return this.cantidadFavoritos
    }
  }

  mensajeroCarrito(numCarrito: number){
    return this.cantidadCarrito = numCarrito
  }

  enviandoCantCarrito(): number{
    if(!isNaN(this.cantidadFavoritos)){
      return this.cantidadCarrito
    }
  }

}
