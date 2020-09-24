import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../modelos-servicios/auth.service';

@Injectable(/* {
  providedIn: 'root'
} */)
export class ValidaTokenService implements HttpInterceptor {

  constructor(private auth: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const miHeader = 'x-access-token';
    const authReq = req.clone({ 
      headers: req.headers.set(miHeader, 
        `${this.auth.obtenerToken()}`)
      });
    return next.handle(authReq);
  }
}
