import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio-sesion',
  templateUrl: './inicio-sesion.component.html',
  styleUrls: ['./inicio-sesion.component.css']
})
export class InicioSesionComponent implements OnInit {

  public usuario : any
  constructor(private _router: Router) {
    this.usuario = {
      identificacion: '',
      passwd: ''
    }
  }

  ngOnInit() {
  }

  enviar(){ 
    alert('se ha enviado formulario ')
    if(this.usuario.identificacion == 16 && this.usuario.passwd == '123'){
      this._router.navigate(['/crearProducto'])
    }
    else{
      alert('Credenciales no validas')
    }
  }

  cancela(){
    this._router.navigate(['/listadoProductos'])
  }

}
