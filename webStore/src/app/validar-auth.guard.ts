import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthService } from '../app/modelos-servicios/auth.service';
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class ValidarAuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router){
    
  }
  canActivate(): boolean{
    if(this.auth.usuarioLogueado()) return true;

    this.router.navigate(['/inicioSesion'])
    return false
  }
  
}
