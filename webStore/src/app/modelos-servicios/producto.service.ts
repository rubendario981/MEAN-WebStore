//importar las librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { variable } from './constantes'
import { modeloProducto } from './modeloProducto';
import { modeloCategoria } from './modeloCategoria';

@Injectable()

export class ProductoService{

    url: String
    producto: modeloProducto
    categoria: modeloCategoria
    
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
    
    crearCategoria(categoria):Observable<any>{
        let params = JSON.stringify(categoria)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        console.log(headers)
        return this._http.post(this.url + 'crearCategoria', params, {headers: headers} )
    }
    
    crearSubCategoria(categoria):Observable<any>{
        let datos = JSON.stringify(categoria)
        return this._http.post(this.url + 'crearSubCategoria', datos )
    }
    
    crearProducto(producto):Observable<any>{                
        let params = JSON.stringify(producto)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'crearProducto', params, {headers: headers} )
    }
    


}