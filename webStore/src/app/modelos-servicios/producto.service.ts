//importar las librerias de angular
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import { variable } from './constantes'

@Injectable()

export class ProductoService {

    url: String

    constructor(private _http: HttpClient) {
        this.url = variable.url
    }

    listarArticulos(): Observable<any> {
        return this._http.get(this.url + 'listarProductos')
    }

    listarCategorias(): Observable<any> {
        return this._http.get(this.url + 'listarCategorias')
    }

    restoreCategories(): Observable<any>{
        return this._http.get(`${this.url}restoreCategories`)
    }

    listarTags(): Observable<any> {
        return this._http.get(this.url + 'listarTags')
    }

    listarSubCategorias(categoria): Observable<any> {
        return this._http.get(this.url + 'listarSubCategorias/' + categoria )
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

    borrarImagen(rutaArchivo): Observable<any> {
        return this._http.delete(this.url + 'deleteImagen/'+ rutaArchivo)
    }

    detalleProducto(idProducto): Observable<any> {
        return this._http.get(this.url + 'detalleProducto/' + idProducto)
    }

    editarProducto(producto): Observable<any> {
        let params = JSON.stringify(producto)
        let miCabecera = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.put(this.url + 'actualizaProducto/' + producto._id, params, { headers: miCabecera })
    }

    eliminarCategoria(categoria): Observable<any> {
        return this._http.delete(this.url + 'eliminarCategoria/' + categoria)
    }

    eliminarSubCategoria(id, cat): Observable<any> {
        return this._http.delete(this.url + 'eliminarSubCategoria/' + id + '/'+ cat)
    }

    validarFav(idUsuario): Observable<any>{
        return this._http.get(this.url + 'validaFav/'+ idUsuario)
    }

    agregaFav(usuario): Observable<any> {        
        let params = JSON.stringify(usuario)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'agregaFav/'+usuario._id, params, { headers: headers })
    }
    
    borrarFav(usuario): Observable<any> {
        let params = JSON.stringify(usuario)
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'borrarFav/'+usuario._id, params, {headers: headers})
    }

    borrarFavlistado(id): Observable<any> {
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'borrarTodoFav/'+id, { headers: headers })
    }

    agregaCart(usuario): Observable<any>{
        let params = JSON.stringify(usuario);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'agregarCarrito/' + usuario._id, params, {headers: headers})
    }

    borrarCart(usuario): Observable<any>{
        let params = JSON.stringify(usuario);
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'borrarCarrito/' + usuario._id, params, {headers: headers})
    }

    vaciarCart(usuario): Observable<any>{
        let headers = new HttpHeaders().set('Content-Type', 'application/json')
        return this._http.post(this.url + 'vaciarCarrito/' + usuario._id, {headers: headers})
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