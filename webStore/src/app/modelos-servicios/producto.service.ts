//importar las librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { variable } from './constantes'
import { modeloProducto } from './modeloProducto';
import { modeloUsuario } from './modeloUsuario';

@Injectable()

export class ProductoService {

    url: String
    public producto: modeloProducto/*  = {
        _id: '',
        nombre: '',
        marca: '',
        categoria: '',
        subCategoria: '',
        imagen: '',
        descripcion: '',
        precio: null,
        fecha: null
    }; */

    public usuario: modeloUsuario

    constructor(private _http: HttpClient) {
        this.url = variable.url
    }

    listarArticulos(): Observable<any> {
        return this._http.get(this.url + 'listarProductos')
    }

    listarCategorias(): Observable<any> {
        return this._http.get(this.url + 'listarCategorias')
    }

    listarSubCategorias(): Observable<any> {
        return this._http.get(this.url + 'listarSubCategorias')
    }

    identificaUsuario(idUsuario): Observable<any> {
        return this._http.get(this.url + 'identificarUsuario/' + idUsuario)
    }

    eliminaUsuario(idUsuario): Observable<any> {
        return this._http.delete(this.url + 'eliminarUsuario/' + idUsuario)
    }

    crearCategoria(producto): Observable<any> {
        let params = JSON.stringify(producto)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'crearCategoria', params, { headers: headers })
    }

    crearSubCategoria(categoria): Observable<any> {
        let params = JSON.stringify(categoria)
        let misHeaders = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'crearSubCategoria', params, { headers: misHeaders })
    }

    crearProducto(producto): Observable<any> {
        let params = JSON.stringify(producto)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'crearProducto', params, { headers: headers })
    }

    detalleProducto(idProducto): Observable<any> {
        return this._http.get(this.url + 'detalleProducto/' + idProducto)
    }

    editarProducto(producto): Observable<any> {
        let params = JSON.stringify(producto)
        let miCabecera = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.put(this.url + 'actualizaProducto/' + producto._id, params, { headers: miCabecera })
    }

    eliminarProducto(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json');
        return this._http.delete(this.url + 'eliminarProducto/' + id, { headers: headers })
    }

    busqueda(varBusqueda): Observable<any> {
        return this._http.get(this.url + 'busqueda/' + varBusqueda)
    }

    registrarUsuario(usuario): Observable<any> {
        let params = JSON.stringify(usuario)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'registroUsuario', params, { headers: headers })
    }

    inicioSesion(usuario): Observable<any> {
        let params = JSON.stringify(usuario)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'inicioSesion', params, { headers: headers })
    }

}