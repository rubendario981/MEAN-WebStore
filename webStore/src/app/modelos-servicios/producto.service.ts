//importar las librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { variable } from './constantes'
import { modeloProducto } from './modeloProducto';

@Injectable()

export class ProductoService{

    url: String
    producto: modeloProducto 
    
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
    
    crearProducto(producto):Observable<any>{        
        
        let datos = JSON.stringify(producto)
        /*let headers = new HttpHeaders().set('Content-Type', 'application/json') */
        return this._http.post(this.url + 'crearProducto', datos )
    }

    


}