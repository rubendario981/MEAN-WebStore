//importar las librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
import { variable } from './constantes'

@Injectable()

export class ProductoService{

    url: String 
    
    constructor(private _http: HttpClient ){
        this.url = variable.url   
    }

    listarArticulos():Observable<any>{
        return this._http.get(this.url + 'listarProductos')
    }

    listarCategorias():Observable<any>{
        return this._http.get(this.url + 'listarCategorias')
    }
    
    listarSubCategorias():Observable<any>{
        return this._http.get(this.url + 'listarSubCategorias')
    }

    


}