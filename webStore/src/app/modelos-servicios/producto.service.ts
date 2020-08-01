//importar las librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { variable } from './constantes'

//se importa el modelo del producto
import { modeloProducto } from './modeloProducto';

@Injectable()

export class ProductoService{

    url: String 
    
    constructor(
        private _http: HttpClient        
    ){
        this.url = variable.url   
    }
    listarArticulos():Observable<any>{
        return this._http.get(this.url + 'listarProductos')
    }
    mostrarImagen():Observable<any>{
        return this._http.get(this.url + 'mostrarImagen')
    }

}