import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { ProductoService} from './producto.service'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private cBend: ProductoService) { }

  usuarioLogueado() {
    return !!localStorage.getItem('token')
  }

  obtenerToken() {
    return localStorage.getItem('token')
  }

  identificaUsuario(){
    const token = localStorage.getItem('token')
    if(!token) return null
    const payLoad = token.split('.')[1]
    return window.atob(payLoad)
  }

  salida(){
    localStorage.removeItem('token')
    this.router.navigate(['/listado'])
  }
}
