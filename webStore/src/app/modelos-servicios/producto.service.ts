//importar las librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { variable } from './constantes'
import { modeloProducto } from './modeloProducto';

@Injectable()

export class ProductoService{

    url: String
    public producto: modeloProducto= {
        _id: '',
        nombre: '',
        marca: '',
        categoria: '',
        subCategoria: '',
        imagen: '',
        descripcion: '',
        precio: null,
        fecha: null
      };
    
    
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
    
    crearCategoria(producto):Observable<any>{
        let params = JSON.stringify(producto)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'crearCategoria', params, {headers: headers} )
    }
    
    crearSubCategoria(categoria):Observable<any>{
        let datos = JSON.stringify(categoria)
        console.log(categoria)
        let misHeaders = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'crearSubCategoria', datos, {headers: misHeaders} )
    }
    
    crearProducto(producto):Observable<any>{  
        let params = JSON.stringify(producto)
        console.log('prod service ')
        console.log(params)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'crearProducto', params, {headers: headers} )
    }

    detalleProducto(idProducto):Observable<any>{
        return this._http.get(this.url + 'buscar/' + idProducto)
    }
    
    editarProducto(producto):Observable<any>{
        let params = JSON.stringify(producto)
        let miCabecera = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.put(this.url + 'actualizaProducto/' + producto._id, params, {headers: miCabecera})         
    }
    
    eliminarProducto(id):Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + '/eliminarProducto' + id, {headers: headers})
    }
    


}