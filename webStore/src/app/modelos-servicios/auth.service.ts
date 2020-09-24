import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  usuarioLogueado() {
    return !!localStorage.getItem('token')
  }

  obtenerToken() {
    return localStorage.getItem('token')
  }
}
